// app.ts — orquestador principal de Lumina.
// Fuente única de estado. Coordina startmenu ↔ mapa ↔ story ↔ bench ↔ HUD ↔ Fermat ↔ persistencia.

import { setLang } from './ui/i18n';
import type { Lang } from './ui/i18n';
import { mountStartMenu } from './ui/startmenu';
import { mountStory } from './ui/story';
import { mountHUD, hudModeFromObjetivo } from './ui/hud';
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
import type { ObjetivoReflexionBlanco, ObjetivoLentes, ObjetivoAberraciones, ObjetivoInstrumentos } from './content/chapters/types';
import { trazarRayos } from './core/content/optics';
import type { EscenaOptica } from './core/content/optics';
import { desviacionMinima, nSellmeier, prismaDesviacion } from './core/dispersion';

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
  /** Posición x normalizada del objeto en modo lentes */
  lentesObjX: number;
  /** Apertura actual en modo aberraciones (0..1) */
  apertura: number;
  /** Separación entre las dos lentes en modo instrumentos */
  instrumentosSeparacion: number;
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
  lentesObjX: -0.60,
  apertura: 1.0,
  instrumentosSeparacion: 0.40,
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
  const esDispersion = objetivo?.tipo === 'dispersion';
  const esLentes = objetivo?.tipo === 'lentes';
  const esAberraciones = objetivo?.tipo === 'aberraciones';
  const esInstrumentos = objetivo?.tipo === 'instrumentos';

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
    // Pasar blanco de reflexión al banco para que lo dibuje
    ...(esReflexionBlanco && objetivo?.tipo === 'reflexion-blanco' ? {
      blancoY: objetivo.blancoY,
      blancoTolerancia: objetivo.tolerancia,
    } : {}),
    // Modo dispersión
    ...(esDispersion ? { dispersionMode: true } : {}),
    // Modo lentes
    ...(esLentes && objetivo?.tipo === 'lentes' ? {
      lentesMode: true,
      lentesF: objetivo.f,
      lentesObjX: STATE.lentesObjX,
    } : {}),
    // Modo aberraciones
    ...(esAberraciones && objetivo?.tipo === 'aberraciones' ? {
      aberracionesMode: true,
      aberracionesF: 0.30,
      apertura: STATE.apertura,
      aperturaMax: objetivo.aperturaMax,
    } : {}),
    // Modo instrumentos
    ...(esInstrumentos && objetivo?.tipo === 'instrumentos' ? {
      instrumentosMode: true,
      instrumentosF1: objetivo.f1,
      instrumentosF2: objetivo.f2,
      instrumentosSeparacion: STATE.instrumentosSeparacion,
    } : {}),
    onAperturaChange(ap: number) {
      STATE.apertura = ap;
      actualizarHUD(capituloId);
      // Verificar objetivo aberraciones
      if (esAberraciones && objetivo?.tipo === 'aberraciones') {
        if (verificarObjetivoAberraciones(ap, objetivo)) {
          manejarDesbloqueo(capituloId);
        }
      }
    },
    onSeparacionChange(sep: number) {
      STATE.instrumentosSeparacion = sep;
      actualizarHUD(capituloId);
      // Verificar objetivo instrumentos
      if (esInstrumentos && objetivo?.tipo === 'instrumentos') {
        if (verificarObjetivoInstrumentos(sep, objetivo)) {
          manejarDesbloqueo(capituloId);
        }
      }
    },
    onAngleChange(theta: number) {
      STATE.thetaInc = theta;
      actualizarHUD(capituloId);
      // Detectar impacto en blanco para reflexion-blanco y notificar al banco
      if (esReflexionBlanco && objetivo?.tipo === 'reflexion-blanco') {
        const impacto = verificarImpactoBlanco(capitulo!.escenaBanco, objetivo, theta);
        bench?.setBlancoImpactado(impacto);
        if (impacto) manejarDesbloqueo(capituloId);
      }
      // Dispersión: verificar si el ángulo está cerca de la desviación mínima
      if (esDispersion && objetivo?.tipo === 'dispersion') {
        actualizarHUD(capituloId);
        if (verificarDispersionMinima(theta, objetivo.toleranciaGrados)) {
          manejarDesbloqueo(capituloId);
        }
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
    onLentesObjChange(objX: number) {
      STATE.lentesObjX = objX;
      actualizarHUD(capituloId);
      // Verificar objetivo lentes
      if (esLentes && objetivo?.tipo === 'lentes') {
        if (verificarObjetivoLentes(objX, objetivo)) {
          manejarDesbloqueo(capituloId);
        }
      }
    },
    ...(capitulo?.escenaBanco ? { escena: capitulo.escenaBanco } : {}),
  };
  bench = new Bench(benchConfig);

  // Verificar impacto inicial (ángulo por defecto puede ya acertar)
  if (esReflexionBlanco && objetivo?.tipo === 'reflexion-blanco') {
    const impactoInicial = verificarImpactoBlanco(capitulo!.escenaBanco, objetivo, STATE.thetaInc);
    bench.setBlancoImpactado(impactoInicial);
  }

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
  } else if (esDispersion && objetivo?.tipo === 'dispersion') {
    montarPanelDispersion(capituloId);
  } else if (esLentes && objetivo?.tipo === 'lentes') {
    montarPanelLentes(capituloId, objetivo);
  } else if (esAberraciones && objetivo?.tipo === 'aberraciones') {
    montarPanelAberraciones(capituloId, objetivo);
  } else if (esInstrumentos && objetivo?.tipo === 'instrumentos') {
    montarPanelInstrumentos(capituloId, objetivo);
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
  const mode = hudModeFromObjetivo(objetivo);

  if (mode === 'oculto') {
    // Pinhole: el HUD no se muestra
    return {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: 0,
      theta2Deg: 0,
      tir: false,
      mode: 'oculto' as const,
    };
  }

  if (mode === 'reflexion' || mode === 'fermat-reflexion') {
    // Reflexión: θᵢ = θᵣ (n1=n2=1)
    const thetaDeg = (STATE.thetaInc * 180) / Math.PI;
    return {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: Math.abs(thetaDeg),
      theta2Deg: Math.abs(thetaDeg),
      tir: false,
      mode,
    };
  }

  if (mode === 'dispersion') {
    const anguloApice = Math.PI / 4;
    const nRef = nSellmeier('BK7', 550);
    const D = prismaDesviacion(nRef, anguloApice, Math.abs(STATE.thetaInc));
    const desviacionDeg = isNaN(D) ? 0 : (D * 180) / Math.PI;
    return {
      n1: 1.0,
      n2: 1.5,
      theta1Deg: (STATE.thetaInc * 180) / Math.PI,
      theta2Deg: 0,
      tir: false,
      mode: 'dispersion' as const,
      desviacionDeg,
      lambdaDominante: 550,
    };
  }

  if (mode === 'lentes') {
    const lentesState = bench?.getLentesState();
    const base = {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: 0,
      theta2Deg: 0,
      tir: false,
      mode: 'lentes' as const,
    };
    if (lentesState) {
      return { ...base, lentesS: lentesState.s, lentesSPrima: lentesState.sPrima, lentesM: lentesState.m, lentesF: lentesState.f };
    }
    return base;
  }

  if (mode === 'aberraciones') {
    const abState = bench?.getAberracionesState?.();
    return {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: 0,
      theta2Deg: 0,
      tir: false,
      mode: 'aberraciones' as const,
      aberracionLSA: abState?.lsa ?? 0,
      aberracionLCA: abState?.lca ?? 0,
      apertura: abState?.apertura ?? STATE.apertura,
    };
  }

  if (mode === 'instrumentos') {
    const instState = bench?.getInstrumentosState?.();
    return {
      n1: 1.0,
      n2: 1.0,
      theta1Deg: 0,
      theta2Deg: 0,
      tir: false,
      mode: 'instrumentos' as const,
      instrumentosSeparacion: instState?.separacion ?? STATE.instrumentosSeparacion,
      instrumentosAfocal: instState?.afocal ?? 0,
      instrumentosAumento: instState?.aumento ?? 0,
    };
  }

  const r = refract(STATE.n1, STATE.n2, STATE.thetaInc);
  return {
    n1: STATE.n1,
    n2: STATE.n2,
    theta1Deg: (STATE.thetaInc * 180) / Math.PI,
    theta2Deg: (r.theta * 180) / Math.PI,
    tir: r.tir,
    mode,
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

// Verificar si el rayo reflejado impacta el blanco — devuelve true si hay impacto
function verificarImpactoBlanco(
  escena: EscenaOptica,
  obj: ObjetivoReflexionBlanco,
  _theta: number
): boolean {
  const escenaActual: EscenaOptica = {
    elementos: escena.elementos.map(el => {
      if (el.tipo === 'fuente') return { ...el, angulo: STATE.thetaInc };
      return el;
    }),
  };
  // Extender el rayo hasta x=0.9 (lado derecho del banco donde está el blanco)
  const puntos = trazarRayos(escenaActual, 0.9);
  if (puntos.length >= 3) {
    // El último punto del rayo reflejado (después del espejo)
    const lastY = puntos[puntos.length - 1]!.y;
    if (Math.abs(lastY - obj.blancoY) < obj.tolerancia) {
      return true;
    }
  }
  return false;
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
  } else if (tipo === 'dispersion') {
    desbloquearHerramienta('espectrometro');
    mostrarBannerDesbloqueo('desbloqueo.espectrometro', 'desbloqueo.espectrometro.descripcion');
  } else if (tipo === 'lentes') {
    desbloquearHerramienta('lente');
    mostrarBannerDesbloqueo('desbloqueo.lente', 'desbloqueo.lente.descripcion');
  } else if (tipo === 'aberraciones') {
    desbloquearHerramienta('diafragma');
    mostrarBannerDesbloqueo('desbloqueo.diafragma', 'desbloqueo.diafragma.descripcion');
  } else if (tipo === 'instrumentos') {
    desbloquearHerramienta('sistema-multi-elemento');
    mostrarBannerDesbloqueo('desbloqueo.sistema-multi-elemento', 'desbloqueo.sistema-multi-elemento.descripcion');
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

// ── Panel dispersión ──────────────────────────────────────────────────────────

let dispersionPanel: HTMLElement | null = null;

function montarPanelDispersion(capituloId: string): void {
  const panel = document.createElement('div');
  panel.className = 'pinhole-panel';  // reutilizamos el estilo del panel pinhole
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="pinhole-panel__label">${t('dispersion.objetivo.instruccion')}</div>
    <button id="btn-dispersion-ok" class="pinhole-panel__btn">
      ${t('dispersion.bench.completar')}
    </button>
  `;

  appContainer.appendChild(panel);
  dispersionPanel = panel;

  panel.querySelector('#btn-dispersion-ok')?.addEventListener('click', () => {
    manejarDesbloqueo(capituloId);
  });
}

/** Verifica si el ángulo de incidencia está cerca de la desviación mínima del prisma */
function verificarDispersionMinima(theta: number, toleranciaGrados: number): boolean {
  const anguloApice = Math.PI / 4;
  const nRef = nSellmeier('BK7', 550);
  const Dmin = desviacionMinima(nRef, anguloApice);
  if (isNaN(Dmin)) return false;
  // El ángulo de incidencia en la desviación mínima es (Dmin + A) / 2
  const incMin = (Dmin + anguloApice) / 2;
  const tolRad = (toleranciaGrados * Math.PI) / 180;
  return Math.abs(Math.abs(theta) - incMin) < tolRad;
}

// ── Panel lentes ──────────────────────────────────────────────────────────────

let lentesPanel: HTMLElement | null = null;

// ── Panel aberraciones ────────────────────────────────────────────────────────

let aberracionesPanel: HTMLElement | null = null;

// ── Panel instrumentos ────────────────────────────────────────────────────────

let instrumentosPanel: HTMLElement | null = null;

function montarPanelLentes(capituloId: string, _obj: ObjetivoLentes): void {
  const panel = document.createElement('div');
  panel.className = 'pinhole-panel';
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="pinhole-panel__label">${t('lentes.bench.objetivo')}</div>
    <button id="btn-lentes-ok" class="pinhole-panel__btn">
      ${t('lentes.bench.completar')}
    </button>
  `;

  appContainer.appendChild(panel);
  lentesPanel = panel;

  panel.querySelector('#btn-lentes-ok')?.addEventListener('click', () => {
    manejarDesbloqueo(capituloId);
  });
}

/** Verifica si el objeto está en 2f (objetivo del capítulo lentes) */
function verificarObjetivoLentes(objX: number, obj: ObjetivoLentes): boolean {
  const s = Math.abs(objX);
  const dos_f = 2 * obj.f;
  return Math.abs(s - dos_f) / dos_f < obj.tolerancia;
}

function montarPanelAberraciones(capituloId: string, _obj: ObjetivoAberraciones): void {
  const panel = document.createElement('div');
  panel.className = 'pinhole-panel';
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="pinhole-panel__label">${t('aberraciones.bench.objetivo')}</div>
    <button id="btn-aberraciones-ok" class="pinhole-panel__btn">
      ${t('aberraciones.bench.completar')}
    </button>
  `;

  appContainer.appendChild(panel);
  aberracionesPanel = panel;

  panel.querySelector('#btn-aberraciones-ok')?.addEventListener('click', () => {
    manejarDesbloqueo(capituloId);
  });
}

/** Verifica si la apertura está suficientemente cerrada (objetivo aberraciones) */
function verificarObjetivoAberraciones(apertura: number, _obj: ObjetivoAberraciones): boolean {
  // El objetivo se cumple cuando la apertura es menor al 25 %
  return apertura < 0.25;
}

function montarPanelInstrumentos(capituloId: string, obj: ObjetivoInstrumentos): void {
  const panel = document.createElement('div');
  panel.className = 'pinhole-panel';
  panel.setAttribute('role', 'complementary');

  panel.innerHTML = `
    <div class="pinhole-panel__label">${t('instrumentos.bench.objetivo.instruccion')}</div>
    <button id="btn-instrumentos-ok" class="pinhole-panel__btn">
      ${t('instrumentos.bench.completar')}
    </button>
  `;

  appContainer.appendChild(panel);
  instrumentosPanel = panel;

  panel.querySelector('#btn-instrumentos-ok')?.addEventListener('click', () => {
    // Verificar que la separación esté cerca de f1+f2 antes de aceptar
    const afocal = obj.f1 + obj.f2;
    const sep = STATE.instrumentosSeparacion;
    if (Math.abs(sep - afocal) / afocal < obj.tolerancia * 2) {
      manejarDesbloqueo(capituloId);
    } else {
      manejarDesbloqueo(capituloId); // aceptar de todas formas al pulsar el botón
    }
  });
}

/** Verifica si la separación es afocal (objetivo instrumentos) */
function verificarObjetivoInstrumentos(sep: number, obj: ObjetivoInstrumentos): boolean {
  const afocal = obj.f1 + obj.f2;
  return Math.abs(sep - afocal) / afocal < obj.tolerancia;
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
  dispersionPanel = null;
  lentesPanel = null;
  aberracionesPanel = null;
  instrumentosPanel = null;
  pinholeInteractuado = false;

  // Limpiar DOM (excepto el appContainer)
  while (appContainer.firstChild) {
    appContainer.removeChild(appContainer.firstChild);
  }
  // Guardia extra: eliminar cualquier HUD huérfano que haya quedado en el documento
  // (position: fixed no lo quita el vaciado de appContainer si el nodo fue movido)
  document.querySelectorAll('.hud').forEach(el => el.remove());

  desbloqueadoYa = false;
}
