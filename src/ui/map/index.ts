// Mapa de progresión — muestra los capítulos del Acto I como sendero vertical.
// Cada nodo tiene estado: bloqueado / disponible / completado / próximamente.
// Clic en un nodo disponible o completado → onCapitulo(id).

import './map.css';
import { t } from '../i18n';
import type { TranslationKey } from '../i18n';
import { fade } from '../../cinematics';
import { conceptosEnRuta, estaDesbloqueado } from '../../core/content/graph';
import { capituloDisponible } from '../../content/chapters';
import { loadProgress } from '../../services/persistence';

export interface MapOptions {
  /** Callback cuando el usuario elige un capítulo disponible o completado */
  onCapitulo: (id: string) => void;
  /** Callback para volver al menú principal */
  onVolver: () => void;
}

type EstadoNodo = 'completado' | 'disponible' | 'bloqueado' | 'proximamente';

/**
 * Monta el mapa de progresión en el contenedor dado.
 * Lee el progreso desde localStorage para determinar el estado de cada nodo.
 */
export function mountMap(container: HTMLElement, opts: MapOptions): void {
  const screen = document.createElement('div');
  screen.className = 'lumina-screen';
  screen.style.opacity = '0';
  screen.setAttribute('role', 'main');
  screen.setAttribute('aria-label', t('mapa.titulo'));

  const progreso = loadProgress();
  const completados = progreso.completados;
  const conceptos = conceptosEnRuta('pedagogica');

  // ── Construir DOM ───────────────────────────────────────────────────────────
  const mapaDiv = document.createElement('div');
  mapaDiv.className = 'mapa';

  const titulo = document.createElement('h2');
  titulo.className = 'mapa__titulo';
  titulo.textContent = t('mapa.titulo');
  mapaDiv.appendChild(titulo);

  const nodosDiv = document.createElement('div');
  nodosDiv.className = 'mapa__nodos';
  nodosDiv.setAttribute('role', 'list');

  conceptos.forEach((concepto, idx) => {
    // Conector antes del nodo (excepto el primero)
    if (idx > 0) {
      const conector = document.createElement('div');
      const prevCompletado = completados.includes(conceptos[idx - 1]!.id);
      conector.className = 'mapa__conector' + (prevCompletado ? ' mapa__conector--activo' : '');
      conector.setAttribute('aria-hidden', 'true');
      nodosDiv.appendChild(conector);
    }

    // Determinar estado del nodo
    const completado   = completados.includes(concepto.id);
    const tieneCapitulo = capituloDisponible(concepto.id);
    const desbloqueado  = estaDesbloqueado(concepto.id, completados);

    let estado: EstadoNodo;
    if (completado) {
      estado = 'completado';
    } else if (!tieneCapitulo) {
      estado = 'proximamente';
    } else if (desbloqueado) {
      estado = 'disponible';
    } else {
      estado = 'bloqueado';
    }

    const nodo = crearNodo(concepto.id, concepto.titulo, estado);
    nodo.setAttribute('role', 'listitem');

    // Interactividad solo en nodos jugables
    if (estado === 'disponible' || estado === 'completado') {
      nodo.setAttribute('tabindex', '0');
      nodo.addEventListener('click', () => opts.onCapitulo(concepto.id));
      nodo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          opts.onCapitulo(concepto.id);
        }
      });
    }

    nodosDiv.appendChild(nodo);
  });

  mapaDiv.appendChild(nodosDiv);

  // Botón volver
  const volverBtn = document.createElement('button');
  volverBtn.className = 'mapa__volver';
  volverBtn.textContent = t('mapa.volver');
  volverBtn.addEventListener('click', opts.onVolver);
  mapaDiv.appendChild(volverBtn);

  screen.appendChild(mapaDiv);
  container.appendChild(screen);

  // Animación de entrada
  requestAnimationFrame(() => {
    fade(screen, { from: 0, to: 1, duration: 400 });
  });

  // Foco inicial al primer nodo jugable
  const primerDisponible = nodosDiv.querySelector<HTMLElement>('[tabindex="0"]');
  if (primerDisponible) {
    setTimeout(() => primerDisponible.focus(), 450);
  }
}

/** Crea el elemento DOM de un nodo del mapa */
function crearNodo(id: string, titulo: string, estado: EstadoNodo): HTMLElement {
  const nodo = document.createElement('div');
  nodo.className = `mapa-nodo mapa-nodo--${estado}`;
  nodo.dataset['conceptoId'] = id;

  const iconoMap: Record<EstadoNodo, { clase: string; texto: string }> = {
    completado:   { clase: 'completado', texto: '✓' },
    disponible:   { clase: 'disponible', texto: '→' },
    bloqueado:    { clase: 'bloqueado',  texto: '○' },
    proximamente: { clase: 'bloqueado',  texto: '·' },
  };

  const etiquetaKey: Record<EstadoNodo, TranslationKey> = {
    completado:   'mapa.nodo.completado',
    disponible:   'mapa.nodo.disponible',
    bloqueado:    'mapa.nodo.bloqueado',
    proximamente: 'mapa.nodo.proximamente',
  };

  const icono = iconoMap[estado];
  const etiqueta = t(etiquetaKey[estado]);

  nodo.innerHTML = `
    <div class="mapa-nodo__icono mapa-nodo__icono--${icono.clase}"
         aria-hidden="true">${icono.texto}</div>
    <div class="mapa-nodo__cuerpo">
      <div class="mapa-nodo__titulo">${titulo}</div>
      <div class="mapa-nodo__estado">${etiqueta}</div>
    </div>
  `;

  nodo.setAttribute('aria-label', `${titulo} — ${etiqueta}`);
  if (estado === 'bloqueado' || estado === 'proximamente') {
    nodo.setAttribute('aria-disabled', 'true');
  }

  return nodo;
}
