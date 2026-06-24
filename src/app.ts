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

/** Estado global de la aplicación */
interface AppState {
  screen: 'menu' | 'story' | 'bench';
  lang: Lang;
  n1: number;
  n2: number;
  thetaInc: number;        // radianes
  fermatMode: boolean;
  capituloActualId: string;
}

const STATE: AppState = {
  screen: 'menu',
  lang: 'es',
  n1: 1.0,
  n2: 1.33,
  thetaInc: Math.PI / 6,  // 30° por defecto
  fermatMode: false,
  capituloActualId: 'refraccion',
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

  // Banco Canvas2D con EscenaOptica del capítulo
  const benchConfig = {
    canvas,
    n1: STATE.n1,
    n2: STATE.n2,
    thetaInc: STATE.thetaInc,
    fermatMode: STATE.fermatMode,
    onAngleChange(theta: number) {
      STATE.thetaInc = theta;
      actualizarHUD();
    },
    onFermatPChange(py: number) {
      if (fermatHandle) fermatHandle.updateP(py);
    },
    ...(capitulo?.escenaBanco ? { escena: capitulo.escenaBanco } : {}),
  };
  bench = new Bench(benchConfig);

  // HUD
  hudHandle = mountHUD(appContainer, calcularHUDState());

  // Panel de Fermat solo si el objetivo es de tipo 'fermat'
  if (capitulo?.objetivo.tipo === 'fermat') {
    const obj = capitulo.objetivo;
    fermatHandle = mountFermatPanel(appContainer, {
      n1: obj.n1,
      n2: obj.n2,
      A: obj.A,
      B: obj.B,
      onMinimo: () => manejarDesbloqueo(capituloId),
    });
  }
}

// ── HUD ─────────────────────────────────────────────────────────────────────

function calcularHUDState() {
  const r = refract(STATE.n1, STATE.n2, STATE.thetaInc);
  return {
    n1: STATE.n1,
    n2: STATE.n2,
    theta1Deg: (STATE.thetaInc * 180) / Math.PI,
    theta2Deg: (r.theta * 180) / Math.PI,
    tir: r.tir,
  };
}

function actualizarHUD(): void {
  if (hudHandle) hudHandle.update(calcularHUDState());
}

// ── Desbloqueo ───────────────────────────────────────────────────────────────

function manejarDesbloqueo(capituloId: string): void {
  if (desbloqueadoYa) return;
  desbloqueadoYa = true;

  const capitulo = getCapitulo(capituloId);
  marcarCompletado(capituloId);

  // Desbloquear la herramienta asociada al objetivo del capítulo
  if (capitulo?.objetivo.tipo === 'fermat') {
    desbloquearHerramienta('interfaz');
  }

  mostrarBannerDesbloqueo();
}

function mostrarBannerDesbloqueo(): void {
  const banner = document.createElement('div');
  banner.className = 'unlock-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', t('desbloqueo.interfaz'));

  banner.innerHTML = `
    <h2>${t('desbloqueo.interfaz')}</h2>
    <p>${t('desbloqueo.descripcion')}</p>
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

  // Limpiar DOM (excepto el appContainer)
  while (appContainer.firstChild) {
    appContainer.removeChild(appContainer.firstChild);
  }
  desbloqueadoYa = false;
}
