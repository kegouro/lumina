// app.ts — orquestador principal de Lumina.
// Fuente única de estado. Coordina startmenu ↔ mapa ↔ story ↔ bench ↔ HUD ↔ Fermat ↔ persistencia.

import { setLang } from './ui/i18n';
import type { Lang } from './ui/i18n';
import { mountStartMenu } from './ui/startmenu';
import { mountStory } from './ui/story';
import { mountHUD } from './ui/hud';
import type { HUDHandle } from './ui/hud';
import { mountFermatPanel } from './ui/fermat';
import type { FermatHandle } from './ui/fermat';
import { mountMap } from './ui/map';
import { Bench } from './render/render2d';
import { refract } from './core/snell';
import { getCapitulo } from './content/chapters';
import { marcarCompletado, desbloquearHerramienta, loadProgress } from './services/persistence';
import { fade } from './cinematics';
import { t } from './ui/i18n';
import type { ObjetivoReflexionBlanco } from './content/chapters/types';
import { trazarRayos } from './core/content/optics';
import type { EscenaOptica } from './core/content/optics';

/** Estado global de la aplicación */
interface AppState {
  screen: 'menu' | 'story' | 'bench';
  lang: Lang;
  n1: number;
  n2: number;
  thetaInc: number;        // radianes
  fermatMode: boolean;
  capituloActualId: string;
  /** Posición x normalizada del objeto pinhole (solo en modo pinhole) */
  pinholeObjX: number;
}

const STATE: AppState = {
  screen: 'menu',
  lang: 'es',
  n1: 1.0,
  n2: 1.33,
  thetaInc: Math.PI / 6,  // 30° por defecto
  fermatMode: false,
  capituloActualId: 'refraccion',
  pinholeObjX: -0.55,
};

let appContainer: HTMLElement;
let hudHandle: HUDHandle | null = null;
let fermatHandle: FermatHandle | null = null;
let bench: Bench | null = null;
let desbloqueadoYa = false;  // Evitar mostrar el banner múltiples veces

export function init(): void {
  const el = document.getElementById('app');
  if (!el) throw new Error('No se encontró #app en el DOM');
  appContainer = el;

  // Recuperar progreso guardado
  loadProgress();

  irAMenu();
}

// ── Navegación ──────────────────────────────────────────────────────────────

function irAMenu(): void {
  limpiarPantalla();
  STATE.screen = 'menu';

  mountStartMenu(appContainer, {
    lang: STATE.lang,
    onHistoria: irAlMapa,
    onLaboratorio: () => { /* stub Fase 0 */ },
    onLangChange(lang) {
      STATE.lang = lang;
      setLang(lang);
    },
  });
}

function irAlMapa(): void {
  limpiarPantalla();
  STATE.screen = 'story';

  mountMap(appContainer, {
    onCapitulo(id) {
      STATE.capituloActualId = id;
      irAStory(id);
    },
    onVolver: irAMenu,
  });
}

function irAStory(capituloId: string): void {
  limpiarPantalla();

  mountStory(appContainer, {
    capituloId,
    onComenzar: () => irAlBanco(capituloId),
  });
}

function irAlBanco(capituloId: string): void {
  limpiarPantalla();
  STATE.screen = 'bench';

  const capitulo = getCapitulo(capituloId);
  const objetivo = capitulo?.objetivo;

  // Wrapper del banco
  const wrapper = document.createElement('div');
  wrapper.className = 'bench-wrapper';

  const canvas = document.createElement('canvas');
  canvas.className = 'bench-canvas';
  canvas.setAttribute('aria-label', t('bench.arrastrar'));
  canvas.setAttribute('role', 'img');

  wrapper.appendChild(canvas);
  appContainer.appendChild(wrapper);

  // Fade de entrada
  wrapper.style.opacity = '0';
  requestAnimationFrame(() => {
    fade(wrapper, { from: 0, to: 1, duration: 500 });
  });

  // Determinar modos según objetivo
  const esPinhole = objetivo?.tipo === 'pinhole';
  const esFermatReflexion = objetivo?.tipo === 'fermat-reflexion';
  const esFermat = objetivo?.tipo === 'fermat';
  const esReflexionBlanco = objetivo?.tipo === 'reflexion-blanco';

  // Banco Canvas2D con EscenaOptica del capítulo
  const benchConfig = {
    canvas,
    n1: STATE.n1,
    n2: STATE.n2,
    thetaInc: STATE.thetaInc,
    fermatMode: esFermat || esFermatReflexion,
    ...(esPinhole ? {
      pinholeMode: true,
      pinholeSize: 0.08,
      objetoX: STATE.pinholeObjX,
    } : {}),
    onAngleChange(theta: number) {
      STATE.thetaInc = theta;
      actualizarHUD(capituloId);
      // Detectar impacto en blanco para reflexion-blanco
      if (esReflexionBlanco && objetivo?.tipo === 'reflexion-blanco') {
        verificarImpactoBlanco(capitulo!.escenaBanco, objetivo, theta);
      }
    },
    onFermatPChange(py: number) {
      if (esPinhole) {
        // En modo pinhole reutilizamos este callback para el movimiento del objeto
        STATE.pinholeObjX = py;
        // Marcar interacción realizada (se completa al hacer clic en el botón)
        pinholeInteractuado = true;
      } else if (fermatHandle) {
        fermatHandle.updateP(py);
      }
    },
    ...(capitulo?.escenaBanco ? { escena: capitulo.escenaBanco } : {}),
  };
  bench = new Bench(benchConfig);

  // HUD — para reflexión mostramos θᵢ = θᵣ en vivo
  hudHandle = mountHUD(appContainer, calcularHUDState(capituloId));

  // Panel por tipo de objetivo
  if (esFermat && objetivo?.tipo === 'fermat') {
    const obj = objetivo;
    fermatHandle = mountFermatPanel(appContainer, {
      n1: obj.n1,
      n2: obj.n2,
      A: obj.A,
      B: obj.B,
      onMinimo: () => manejarDesbloqueo(capituloId),
    });
  } else if (esFermatReflexion && objetivo?.tipo === 'fermat-reflexion') {
    // Fermat en reflexión: n1=n2=1, A y B en el mismo lado
    const obj = objetivo;
    fermatHandle = mountFermatPanel(appContainer, {
      n1: 1.0,
      n2: 1.0,
      A: obj.A,
      B: obj.B,
      onMinimo: () => manejarDesbloqueo(capituloId),
    });
  } else if (esPinhole) {
    montarPanelPinhole(capituloId);
  } else if (esReflexionBlanco && objetivo?.tipo === 'reflexion-blanco') {
    montarPanelReflexion(capituloId, objetivo);
  }
}

// ── Panel pinhole ─────────────────────────────────────────────────────────────

let pinholeInteractuado = false;
let pinholePanel: HTMLElement | null = null;

function montarPanelPinhole(capituloId: string): void {
  pinholeInteractuado = false;
  const panel = document.createElement('div');
  panel.className = 'pinhole-panel';
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="pinhole-panel__label">${t('bench.pinhole.instruccion')}</div>
    <button id="btn-pinhole-ok" class="pinhole-panel__btn">
      ${t('bench.pinhole.completar')}
    </button>
  `;

  appContainer.appendChild(panel);
  pinholePanel = panel;

  panel.querySelector('#btn-pinhole-ok')?.addEventListener('click', () => {
    pinholeInteractuado = true;
    manejarDesbloqueo(capituloId);
  });
}

// ── Panel reflexión blanco ────────────────────────────────────────────────────

let reflexionPanel: HTMLElement | null = null;

function montarPanelReflexion(capituloId: string, obj: ObjetivoReflexionBlanco): void {
  const panel = document.createElement('div');
  panel.className = 'reflexion-panel';
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="reflexion-panel__label">${t('bench.reflexion.blanco')}</div>
    <div class="reflexion-panel__angles" id="reflexion-angles">θᵢ = — | θᵣ = —</div>
  `;

  appContainer.appendChild(panel);
  reflexionPanel = panel;

  // Guardar referencia del objetivo para la verificación por ángulo
  (panel as any)._obj = obj;
  (panel as any)._capituloId = capituloId;
}

// ── HUD ─────────────────────────────────────────────────────────────────────

function calcularHUDState(capituloId?: string) {
  const capitulo = capituloId ? getCapitulo(capituloId) : undefined;
  const objetivo = capitulo?.objetivo;
  const esReflexion = objetivo?.tipo === 'reflexion-blanco' || objetivo?.tipo === 'fermat-reflexion';

  if (esReflexion) {
    // En reflexión θᵢ = θᵣ (n1=n2=1)
    const thetaDeg = (STATE.thetaInc * 180) / Math.PI;
    return {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: Math.abs(thetaDeg),
      theta2Deg: Math.abs(thetaDeg),
      tir: false,
    };
  }

  const r = refract(STATE.n1, STATE.n2, STATE.thetaInc);
  return {
    n1: STATE.n1,
    n2: STATE.n2,
    theta1Deg: (STATE.thetaInc * 180) / Math.PI,
    theta2Deg: (r.theta * 180) / Math.PI,
    tir: r.tir,
  };
}

function actualizarHUD(capituloId?: string): void {
  if (hudHandle) hudHandle.update(calcularHUDState(capituloId));
  // Actualizar panel de reflexión si existe
  if (reflexionPanel) {
    const thetaDeg = Math.abs((STATE.thetaInc * 180) / Math.PI).toFixed(1);
    const anglesEl = reflexionPanel.querySelector('#reflexion-angles');
    if (anglesEl) {
      anglesEl.textContent = `θᵢ = ${thetaDeg}° | θᵣ = ${thetaDeg}°`;
    }
  }
}

// Verificar si el rayo reflejado impacta el blanco
function verificarImpactoBlanco(
  escena: EscenaOptica,
  obj: ObjetivoReflexionBlanco,
  _theta: number
): void {
  const escenaActual: EscenaOptica = {
    elementos: escena.elementos.map(el => {
      if (el.tipo === 'fuente') return { ...el, angulo: STATE.thetaInc };
      return el;
    }),
  };
  const puntos = trazarRayos(escenaActual, 0.95);
  if (puntos.length >= 3) {
    // El último punto es la extensión final del rayo reflejado
    const lastY = puntos[puntos.length - 1]!.y;
    if (Math.abs(lastY - obj.blancoY) < obj.tolerancia) {
      manejarDesbloqueo(STATE.capituloActualId);
    }
  }
}

// ── Desbloqueo ───────────────────────────────────────────────────────────────

function manejarDesbloqueo(capituloId: string): void {
  if (desbloqueadoYa) return;
  desbloqueadoYa = true;

  const capitulo = getCapitulo(capituloId);
  marcarCompletado(capituloId);

  // Desbloquear la herramienta asociada al objetivo del capítulo
  const tipo = capitulo?.objetivo.tipo;
  if (tipo === 'fermat') {
    desbloquearHerramienta('interfaz');
    mostrarBannerDesbloqueo('desbloqueo.interfaz', 'desbloqueo.descripcion');
  } else if (tipo === 'pinhole') {
    desbloquearHerramienta('fuente');
    mostrarBannerDesbloqueo('desbloqueo.fuente', 'desbloqueo.fuente.descripcion');
  } else if (tipo === 'reflexion-blanco') {
    desbloquearHerramienta('espejo-plano');
    mostrarBannerDesbloqueo('desbloqueo.espejo-plano', 'desbloqueo.espejo-plano.descripcion');
  } else if (tipo === 'fermat-reflexion') {
    desbloquearHerramienta('espejo-plano');
    mostrarBannerDesbloqueo('desbloqueo.espejo-plano', 'desbloqueo.espejo-plano.descripcion');
  } else {
    mostrarBannerDesbloqueo('desbloqueo.interfaz', 'desbloqueo.descripcion');
  }
}

function mostrarBannerDesbloqueo(tituloKey: import('./ui/i18n').TranslationKey, descripKey: import('./ui/i18n').TranslationKey): void {
  const banner = document.createElement('div');
  banner.className = 'unlock-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', t(tituloKey));

  banner.innerHTML = `
    <h2>${t(tituloKey)}</h2>
    <p>${t(descripKey)}</p>
    <button id="btn-cerrar-banner">${t('refraccion.comenzar')}</button>
  `;

  appContainer.appendChild(banner);

  // Animar entrada
  requestAnimationFrame(() => {
    banner.classList.add('visible');
  });

  banner.querySelector('#btn-cerrar-banner')?.addEventListener('click', () => {
    fade(banner, { from: 1, to: 0, duration: 300 }).then(() => banner.remove());
  });
}

// ── Utilidades ───────────────────────────────────────────────────────────────

function limpiarPantalla(): void {
  // Destruir recursos anteriores
  bench?.destroy();
  bench = null;
  hudHandle?.destroy();
  hudHandle = null;
  fermatHandle?.destroy();
  fermatHandle = null;
  pinholePanel = null;
  reflexionPanel = null;
  pinholeInteractuado = false;

  // Limpiar DOM (excepto el appContainer)
  while (appContainer.firstChild) {
    appContainer.removeChild(appContainer.firstChild);
  }
  desbloqueadoYa = false;
}
