// HUD de cristal — panel arrastrable y plegable con glassmorphism Pharos.
// Consciente del capítulo: muestra información relevante según el tipo de objetivo.
import { t } from '../i18n';
import type { Objetivo } from '../../content/chapters/types';

export type HUDMode = 'refraccion' | 'reflexion' | 'fermat-reflexion' | 'dispersion' | 'lentes' | 'aberraciones' | 'instrumentos' | 'oculto';

export interface HUDState {
  n1: number;
  n2: number;
  theta1Deg: number;
  theta2Deg: number;
  tir: boolean;
  /** Modo del HUD según el capítulo */
  mode?: HUDMode;
  /** Desviación del prisma en grados (modo dispersion) */
  desviacionDeg?: number;
  /** Longitud de onda dominante del espectro (modo dispersion) */
  lambdaDominante?: number;
  /** s, s', m, f para el modo lentes */
  lentesS?: number;
  lentesSPrima?: number;
  lentesM?: number;
  lentesF?: number;
  /** Aberración esférica longitudinal (modo aberraciones) */
  aberracionLSA?: number;
  /** Aberración cromática longitudinal (modo aberraciones) */
  aberracionLCA?: number;
  /** Apertura normalizada actual (modo aberraciones) */
  apertura?: number;
  /** Separación entre lentes (modo instrumentos) */
  instrumentosSeparacion?: number;
  /** f1+f2 de referencia (modo instrumentos) */
  instrumentosAfocal?: number;
  /** Aumento angular (modo instrumentos) */
  instrumentosAumento?: number;
}

export interface HUDHandle {
  update(s: HUDState): void;
  destroy(): void;
}

/** Determina el modo HUD a partir del tipo de objetivo del capítulo */
export function hudModeFromObjetivo(objetivo: Objetivo | undefined): HUDMode {
  if (!objetivo) return 'refraccion';
  switch (objetivo.tipo) {
    case 'pinhole':          return 'oculto';
    case 'reflexion-blanco': return 'reflexion';
    case 'fermat-reflexion': return 'fermat-reflexion';
    case 'fermat':           return 'refraccion';
    case 'dispersion':       return 'dispersion';
    case 'lentes':           return 'lentes';
    case 'aberraciones':     return 'aberraciones';
    case 'instrumentos':     return 'instrumentos';
    default:                 return 'refraccion';
  }
}

export function mountHUD(container: HTMLElement, initial: HUDState): HUDHandle {
  // Invariante: el HUD es un singleton. Elimina cualquier panel previo huérfano
  // (evita el "HUD fantasma" si quedara uno de un montaje anterior).
  document.querySelectorAll('.hud').forEach((el) => el.remove());

  // Si el modo es 'oculto', no montar nada
  if (initial.mode === 'oculto') {
    return {
      update(_s: HUDState) { /* no-op */ },
      destroy() { /* no-op */ },
    };
  }

  // Crear el panel
  const panel = document.createElement('div');
  panel.className = 'hud';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', t('hud.elemento'));

  let collapsed = false;
  let currentState = initial;

  const render = (s: HUDState) => {
    currentState = s;
    const mode = s.mode ?? 'refraccion';

    // Si llega un update con mode oculto, ocultar el panel
    if (mode === 'oculto') {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = '';

    const fmt = (v: number, dec = 2) => v.toFixed(dec);

    let bodyContent: string;
    let titleText: string;

    if (mode === 'reflexion' || mode === 'fermat-reflexion') {
      // Capítulos de reflexión: mostrar θᵢ = θᵣ
      const titulo = mode === 'fermat-reflexion'
        ? t('fermat.reflexion.titulo')
        : t('reflexion.titulo');
      titleText = titulo;
      bodyContent = `
        <span class="hud__label">θᵢ</span>
        <span class="hud__value">${fmt(s.theta1Deg, 1)}°</span>
        <span class="hud__label">θᵣ</span>
        <span class="hud__value">${fmt(s.theta1Deg, 1)}°</span>
        <div class="hud__law-row">θᵢ = θᵣ</div>
      `;
    } else if (mode === 'dispersion') {
      titleText = t('dispersion.titulo');
      const D = s.desviacionDeg ?? 0;
      const lam = s.lambdaDominante ?? 550;
      bodyContent = `
        <span class="hud__label">${t('dispersion.bench.desviacion')}</span>
        <span class="hud__value">${fmt(D, 1)}°</span>
        <span class="hud__label">${t('dispersion.bench.lambda')}</span>
        <span class="hud__value">${lam.toFixed(0)} nm</span>
      `;
    } else if (mode === 'lentes') {
      titleText = t('lentes.titulo');
      const s_ = s.lentesS ?? 0;
      const sp = s.lentesSPrima;
      const m = s.lentesM ?? 0;
      const f = s.lentesF ?? 0;
      const spStr = sp === undefined || !isFinite(sp) ? '∞' : fmt(sp, 2);
      const realVirtual = (sp !== undefined && isFinite(sp) && sp > 0) ? t('lentes.bench.real') : t('lentes.bench.virtual');
      bodyContent = `
        <span class="hud__label">${t('lentes.bench.s')}</span>
        <span class="hud__value">${fmt(s_, 2)}</span>
        <span class="hud__label">${t('lentes.bench.sPrima')}</span>
        <span class="hud__value">${spStr} (${realVirtual})</span>
        <span class="hud__label">${t('lentes.bench.m')}</span>
        <span class="hud__value">${fmt(m, 2)}</span>
        <span class="hud__label">${t('lentes.bench.f')}</span>
        <span class="hud__value">${fmt(f, 2)}</span>
      `;
    } else if (mode === 'aberraciones') {
      titleText = t('aberraciones.titulo');
      const lsa = s.aberracionLSA ?? 0;
      const lca = s.aberracionLCA ?? 0;
      const ap = s.apertura ?? 0;
      bodyContent = `
        <span class="hud__label">${t('aberraciones.bench.apertura')}</span>
        <span class="hud__value">${fmt(ap, 3)}</span>
        <span class="hud__label">${t('aberraciones.bench.lsa')}</span>
        <span class="hud__value">${fmt(Math.abs(lsa), 4)}</span>
        <span class="hud__label">${t('aberraciones.bench.lca')}</span>
        <span class="hud__value">${fmt(Math.abs(lca), 4)}</span>
      `;
    } else if (mode === 'instrumentos') {
      titleText = t('instrumentos.titulo');
      const sep = s.instrumentosSeparacion ?? 0;
      const afocal = s.instrumentosAfocal ?? 0;
      const aumento = s.instrumentosAumento ?? 0;
      bodyContent = `
        <span class="hud__label">${t('instrumentos.bench.separacion')}</span>
        <span class="hud__value">${fmt(sep, 3)}</span>
        <span class="hud__label">${t('instrumentos.bench.f1f2')}</span>
        <span class="hud__value">${fmt(afocal, 3)}</span>
        <span class="hud__label">${t('instrumentos.bench.aumento')}</span>
        <span class="hud__value">${fmt(aumento, 2)}×</span>
      `;
    } else {
      // Capítulo de refracción (modo por defecto)
      titleText = t('refraccion.titulo');
      bodyContent = `
        <span class="hud__label">${t('hud.n1')}</span>
        <span class="hud__value">${fmt(s.n1)}</span>
        <span class="hud__label">${t('hud.n2')}</span>
        <span class="hud__value">${fmt(s.n2)}</span>
        <span class="hud__label">${t('hud.theta1')}</span>
        <span class="hud__value">${fmt(s.theta1Deg, 1)}°</span>
        <span class="hud__label">${t('hud.theta2')}</span>
        <span class="hud__value ${s.tir ? 'tir' : ''}">${s.tir ? '—' : fmt(s.theta2Deg, 1) + '°'}</span>
        ${s.tir ? `<div class="hud__tir-row">${t('hud.tir')}</div>` : ''}
      `;
    }

    panel.innerHTML = `
      <div class="hud__header">
        <span class="hud__title">${titleText}</span>
        <button class="hud__toggle" aria-expanded="${!collapsed}"
                aria-controls="hud-body">
          ${collapsed ? t('hud.desplegar') : t('hud.plegar')}
        </button>
      </div>
      <div class="hud__body ${collapsed ? 'collapsed' : ''}" id="hud-body">
        ${bodyContent}
      </div>
    `;

    // Conectar botón plegar
    const btn = panel.querySelector('.hud__toggle') as HTMLButtonElement | null;
    if (btn) {
      btn.onclick = () => {
        collapsed = !collapsed;
        render(currentState);
      };
    }
  };

  render(initial);
  container.appendChild(panel);

  // Hacer el HUD arrastrable
  makeDraggable(panel);

  return {
    update(s: HUDState) { render(s); },
    destroy() { panel.remove(); },
  };
}

/** Hace un elemento arrastrable dentro del viewport */
function makeDraggable(el: HTMLElement): void {
  let startX = 0;
  let startY = 0;
  let origLeft = 0;
  let origTop = 0;
  let dragging = false;

  const onDown = (e: PointerEvent) => {
    // No iniciar drag si se hace clic en el botón de plegar
    if ((e.target as HTMLElement).classList.contains('hud__toggle')) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = el.getBoundingClientRect();
    origLeft = rect.left;
    origTop = rect.top;
    el.classList.add('dragging');
    el.setPointerCapture(e.pointerId);
  };

  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    // Mantener dentro del viewport
    const newLeft = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, origLeft + dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, origTop + dy));
    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;
    el.style.right = 'auto';
  };

  const onUp = () => {
    dragging = false;
    el.classList.remove('dragging');
  };

  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
}
