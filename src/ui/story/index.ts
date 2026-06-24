// Story — escena cinematográfica genérica para cualquier capítulo.
// Lee la EscenaCinematica del capítulo vía getCapitulo(id).
import { t } from '../i18n';
import type { TranslationKey } from '../i18n';
import { fade, runSequence } from '../../cinematics';
import { getCapitulo } from '../../content/chapters';

export interface StoryOptions {
  capituloId: string;
  onComenzar: () => void;
}

export function mountStory(container: HTMLElement, opts: StoryOptions): void {
  const capitulo = getCapitulo(opts.capituloId);

  if (!capitulo) {
    // Capítulo no implementado — pantalla de error mínima
    const screen = document.createElement('div');
    screen.className = 'lumina-screen';
    screen.setAttribute('role', 'main');
    screen.innerHTML = `<div class="story"><p style="color:var(--color-muted)">Capítulo no disponible: ${opts.capituloId}</p></div>`;
    container.appendChild(screen);
    return;
  }

  const esc = capitulo.escena;

  const screen = document.createElement('div');
  screen.className = 'lumina-screen';
  screen.style.opacity = '0';
  screen.setAttribute('role', 'main');
  screen.setAttribute('aria-label', t(esc.tituloKey as TranslationKey));

  screen.innerHTML = `
    <div class="story">
      <p class="story__frase" id="story-frase">${t(esc.fraseKey as TranslationKey)}</p>
      <p class="story__intuicion" id="story-intuicion">${t(esc.intuicionKey as TranslationKey)}</p>
      <button class="story__deduccion-toggle" id="story-toggle"
              aria-expanded="false" aria-controls="story-deduccion">
        ${t(esc.deduccionVerKey as TranslationKey)}
      </button>
      <div class="story__deduccion" id="story-deduccion" aria-hidden="true">
        <h3>${t(esc.deduccionTituloKey as TranslationKey)}</h3>
        <div class="story__formula">${t(esc.deduccionTextoKey as TranslationKey)}</div>
        <p>${t(esc.deduccionDerivacionKey as TranslationKey)}</p>
      </div>
      <button class="btn-primary" id="story-comenzar" style="max-width: 280px;">
        ${t(esc.comenzarKey as TranslationKey)}
      </button>
    </div>
  `;

  container.appendChild(screen);

  // Conectar toggle de deducción
  const toggleBtn  = screen.querySelector('#story-toggle') as HTMLButtonElement;
  const deduccion  = screen.querySelector('#story-deduccion') as HTMLElement;
  let abierto = false;
  toggleBtn.addEventListener('click', () => {
    abierto = !abierto;
    deduccion.classList.toggle('visible', abierto);
    deduccion.setAttribute('aria-hidden', String(!abierto));
    toggleBtn.setAttribute('aria-expanded', String(abierto));
    toggleBtn.textContent = abierto
      ? t(esc.deduccionOcultarKey as TranslationKey)
      : t(esc.deduccionVerKey as TranslationKey);
  });

  // Botón al banco
  screen.querySelector('#story-comenzar')?.addEventListener('click', opts.onComenzar);

  // Secuencia cinematográfica de entrada
  const frase       = screen.querySelector('#story-frase') as HTMLElement;
  const intuicion   = screen.querySelector('#story-intuicion') as HTMLElement;
  const comenzarBtn = screen.querySelector('#story-comenzar') as HTMLElement;
  frase.style.opacity       = '0';
  intuicion.style.opacity   = '0';
  comenzarBtn.style.opacity = '0';

  runSequence([
    () => fade(screen, { from: 0, to: 1, duration: 600 }),
    () => new Promise(r => setTimeout(r, 200)),
    () => fade(frase, { from: 0, to: 1, duration: 800 }),
    () => new Promise(r => setTimeout(r, 400)),
    () => fade(intuicion, { from: 0, to: 1, duration: 600 }),
    () => new Promise(r => setTimeout(r, 300)),
    () => fade(comenzarBtn, { from: 0, to: 1, duration: 400 }),
  ]);
}
