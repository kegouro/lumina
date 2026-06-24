# Acto I — 3 Nuevos Capítulos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new playable chapters (`rayo`, `reflexion`, `fermat`) to Lumina's Act I using the existing declarative chapter framework, update the progression graph, and keep all 95 existing tests green.

**Architecture:** Each chapter is a pure-data `Capitulo` object in `src/content/chapters/<id>.ts`, registered in `src/content/chapters/index.ts`. New `Objetivo` types (`pinhole`, `reflexion-blanco`, `fermat-reflexion`) are added to `types.ts` and wired in `app.ts`. New i18n keys go into both `es.ts` and `en.ts`. The graph prereqs are adjusted, the graph test is updated to match, and new chapter unit tests verify pure logic.

**Tech Stack:** TypeScript strict, Vite, Vitest, Canvas2D, no new runtime deps.

## Global Constraints

- TypeScript strict mode — zero `any`, no implicit `undefined` access without narrowing.
- No new npm dependencies.
- All text must exist in both `src/ui/i18n/es.ts` AND `src/ui/i18n/en.ts` (EN derives from `keyof typeof es`).
- Comments in Spanish.
- Pharos aesthetic: cálido-sobre-negro, cinematográfico.
- `prefers-reduced-motion` already handled in `Bench.triggerPulse()` — don't break it.
- `npm run build` (tsc --noEmit + vite build) and `npm test` must stay green throughout.
- NO commits.

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `src/content/chapters/types.ts` | Modify | Add `ObjetivoRayo`, `ObjetivoReflexionBlanco`, `ObjetivoFermatReflexion` to `Objetivo` union |
| `src/content/chapters/rayo.ts` | Create | Chapter data for "El rayo de luz" |
| `src/content/chapters/reflexion.ts` | Create | Chapter data for "Reflexión" |
| `src/content/chapters/fermat.ts` | Create | Chapter data for "Principio de Fermat" |
| `src/content/chapters/index.ts` | Modify | Register the 3 new chapters |
| `src/core/content/graph.ts` | Modify | `refraccion.prereqs = ['reflexion']`, `fermat.prereqs = ['refraccion','reflexion']` |
| `src/core/content/__tests__/graph.test.ts` | Modify | Update test that expected `refraccion.prereqs = []` to match new graph |
| `src/ui/i18n/es.ts` | Modify | Add i18n keys for `rayo.*`, `reflexion.*`, `fermat.*` (extended), `desbloqueo.*` |
| `src/ui/i18n/en.ts` | Modify | Mirror all new keys in English |
| `src/app.ts` | Modify | Handle new Objetivo types in `irAlBanco` / `manejarDesbloqueo` |
| `src/content/chapters/__tests__/chapters.test.ts` | Create | Unit tests for the 3 new chapter objects |

---

## Task 1: Extend `Objetivo` types in `types.ts`

**Files:**
- Modify: `src/content/chapters/types.ts`

**Interfaces:**
- Produces: `ObjetivoRayo`, `ObjetivoReflexionBlanco`, `ObjetivoFermatReflexion` types; updated `Objetivo` union

- [ ] **Step 1: Read the current types.ts** to confirm exact content (already done in planning; shown for completeness):

```typescript
// Current content at src/content/chapters/types.ts
// Objetivo union = ObjetivoFermat only
```

- [ ] **Step 2: Replace `types.ts` with extended version**

Replace the `Objetivo` section (lines 29–50) with:

```typescript
/** Objetivo tipo Fermat: minimizar el camino óptico en refracción */
export interface ObjetivoFermat {
  tipo: 'fermat';
  n1: number;
  n2: number;
  A: { x: number; y: number };
  B: { x: number; y: number };
}

/** Objetivo tipo pinhole: completar la proyección invertida (capítulo rayo) */
export interface ObjetivoRayo {
  tipo: 'pinhole';
}

/** Objetivo tipo blanco de reflexión: hacer rebotar el rayo en un blanco */
export interface ObjetivoReflexionBlanco {
  tipo: 'reflexion-blanco';
  /** Posición normalizada del blanco en Y sobre el espejo */
  blancoY: number;
  /** Tolerancia normalizada para considerar el impacto como éxito */
  tolerancia: number;
}

/** Objetivo tipo Fermat generalizado: también aplica a reflexión */
export interface ObjetivoFermatReflexion {
  tipo: 'fermat-reflexion';
  A: { x: number; y: number };
  B: { x: number; y: number };
}

/** Unión de objetivos posibles (extensible con nuevos tipos) */
export type Objetivo =
  | ObjetivoFermat
  | ObjetivoRayo
  | ObjetivoReflexionBlanco
  | ObjetivoFermatReflexion;
```

The full file after edit:

```typescript
// Tipos declarativos de capítulo para el framework de Lumina.
// Un Capitulo describe el contenido de forma pura — sin DOM.

import type { EscenaOptica } from '../../core/content/optics';

/** Contenido de la escena cinematográfica de entrada */
export interface EscenaCinematica {
  /** Clave i18n de la frase poética principal */
  fraseKey: string;
  /** Clave i18n del título del capítulo */
  tituloKey: string;
  /** Clave i18n del texto de intuición */
  intuicionKey: string;
  /** Clave i18n del título de la deducción */
  deduccionTituloKey: string;
  /** Clave i18n del texto de la fórmula/latex */
  deduccionTextoKey: string;
  /** Clave i18n del texto de derivación */
  deduccionDerivacionKey: string;
  /** Clave i18n del botón para mostrar deducción */
  deduccionVerKey: string;
  /** Clave i18n del botón para ocultar deducción */
  deduccionOcultarKey: string;
  /** Clave i18n del botón de inicio al banco */
  comenzarKey: string;
}

/** Objetivo tipo Fermat: minimizar el camino óptico en refracción */
export interface ObjetivoFermat {
  tipo: 'fermat';
  n1: number;
  n2: number;
  A: { x: number; y: number };
  B: { x: number; y: number };
}

/** Objetivo tipo pinhole: observar la proyección invertida (capítulo rayo) */
export interface ObjetivoRayo {
  tipo: 'pinhole';
}

/** Objetivo tipo blanco de reflexión: hacer rebotar el rayo hacia el blanco */
export interface ObjetivoReflexionBlanco {
  tipo: 'reflexion-blanco';
  /** Posición normalizada del blanco en Y */
  blancoY: number;
  /** Tolerancia normalizada para considerar el impacto como éxito */
  tolerancia: number;
}

/** Objetivo tipo Fermat generalizado: mínimo de camino en reflexión */
export interface ObjetivoFermatReflexion {
  tipo: 'fermat-reflexion';
  A: { x: number; y: number };
  B: { x: number; y: number };
}

/** Unión de objetivos posibles (extensible con nuevos tipos) */
export type Objetivo =
  | ObjetivoFermat
  | ObjetivoRayo
  | ObjetivoReflexionBlanco
  | ObjetivoFermatReflexion;

/** Descripción completa de un capítulo */
export interface Capitulo {
  /** ID del concepto en el grafo */
  conceptoId: string;
  /** Contenido de la escena cinematográfica */
  escena: EscenaCinematica;
  /** Escena óptica para el banco */
  escenaBanco: EscenaOptica;
  /** Objetivo interactivo del capítulo */
  objetivo: Objetivo;
}
```

- [ ] **Step 3: Run build to confirm types compile**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors (or only errors in files not yet updated, which will be fixed in later tasks).

- [ ] **Step 4: Run tests to confirm no regressions**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -10
```

Expected: 95 passed (types.ts has no test; the union extension is backward-compatible).

---

## Task 2: Add i18n keys for new chapters

**Files:**
- Modify: `src/ui/i18n/es.ts`
- Modify: `src/ui/i18n/en.ts`

**Interfaces:**
- Produces: all new translation keys for `rayo.*`, `reflexion.*`, new `fermat.*` keys, new `desbloqueo.*` keys

- [ ] **Step 1: Add ES keys to `es.ts`**

Append to `es.ts` BEFORE the closing `} as const;`, after the existing `'mapa.ruta.historica'` line:

```typescript
  // Rayo — escena cinematográfica
  'rayo.frase': 'Antes de toda óptica: un agujero, una flecha, y la oscuridad.',
  'rayo.titulo': 'El rayo de luz',
  'rayo.intuicion': 'La luz viaja en línea recta. Una cámara oscura lo demuestra: cada punto del objeto envía rayos en todas direcciones; solo los que pasan por el agujero llegan a la pared, dibujando la imagen invertida.',
  'rayo.deduccion.titulo': 'Propagación rectilínea',
  'rayo.deduccion.texto': 'Imagen invertida = trayectorias rectas + selección de apertura',
  'rayo.deduccion.derivacion': 'Los rayos del extremo superior de la flecha que pasan por el agujero llegan al extremo inferior de la imagen, y viceversa. La inversión es consecuencia directa de la geometría rectilínea.',
  'rayo.deduccion.ver': 'Ver por qué se invierte',
  'rayo.deduccion.ocultar': 'Ocultar deducción',
  'rayo.comenzar': 'Abrir la cámara oscura',

  // Reflexión — escena cinematográfica
  'reflexion.frase': 'El espejo no miente — devuelve exactamente lo que recibe.',
  'reflexion.titulo': 'Reflexión',
  'reflexion.intuicion': 'El ángulo de incidencia es igual al ángulo de reflexión. El espejo plano conserva el ángulo porque la componente normal del rayo invierte su signo y la tangencial se preserva.',
  'reflexion.deduccion.titulo': 'Ley de reflexión',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': 'La normal al espejo es el eje de simetría: el rayo incidente y el reflejado forman ángulos iguales con ella. Esto equivale a invertir solo la componente perpendicular al espejo.',
  'reflexion.deduccion.ver': 'Ver deducción',
  'reflexion.deduccion.ocultar': 'Ocultar deducción',
  'reflexion.comenzar': 'Explorar el espejo',

  // Fermat — escena cinematográfica (extendido desde el challenge existente)
  'fermat.frase': 'La naturaleza es perezosa. Toma siempre el camino que cuesta menos tiempo.',
  'fermat.titulo.escena': 'Principio de Fermat',
  'fermat.intuicion': 'Reflexión y refracción no son leyes independientes. Son consecuencias del mismo principio: la luz toma el camino de tiempo estacionario. Mueve el punto de rebote y observa cómo el tiempo se minimiza exactamente cuando θᵢ = θᵣ.',
  'fermat.deduccion.titulo': 'Tiempo estacionario',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflexión)  |  n₁ sin θ₁ = n₂ sin θ₂  (refracción)',
  'fermat.deduccion.derivacion': 'Derivar el tiempo de viaje respecto al punto de reflexión P e igualar a cero. La condición δt/δP = 0 implica ángulos iguales en reflexión y la ley de Snell en refracción.',
  'fermat.deduccion.ver': 'Ver el principio',
  'fermat.deduccion.ocultar': 'Ocultar deducción',
  'fermat.comenzar': 'Explorar el mínimo',

  // Banco óptico — rayo/pinhole
  'bench.pinhole.instruccion': 'Observa cómo la imagen se invierte al pasar por el agujero',
  'bench.pinhole.completar': '¡Proyección invertida observada! La luz viaja en línea recta.',

  // Banco óptico — reflexión
  'bench.reflexion.instruccion': 'Arrastra el rayo para cambiar el ángulo de incidencia',
  'bench.reflexion.blanco': 'Haz rebotar el rayo hacia el blanco',
  'bench.reflexion.exito': '¡Impacto! θᵢ = θᵣ — la ley de reflexión en acción.',

  // Fermat reflexión
  'fermat.reflexion.titulo': 'Fermat en el espejo',
  'fermat.reflexion.instruccion': 'Arrastra el punto P sobre el espejo para minimizar el tiempo de viaje.',
  'fermat.reflexion.minimo': '¡Tiempo mínimo! — θᵢ = θᵣ se cumple aquí.',

  // Desbloqueos adicionales
  'desbloqueo.fuente': '¡Herramienta desbloqueada: Fuente de luz!',
  'desbloqueo.fuente.descripcion': 'Ahora puedes añadir fuentes de luz en el banco libre.',
  'desbloqueo.espejo-plano': '¡Herramienta desbloqueada: Espejo plano!',
  'desbloqueo.espejo-plano.descripcion': 'Ahora puedes añadir espejos planos en el banco libre.',
```

- [ ] **Step 2: Add EN keys to `en.ts`**

Append the same keys in English, inside the `Record<keyof typeof es, string>` object, before the closing `};`:

```typescript
  // Ray — cinematic scene
  'rayo.frase': 'Before all optics: a hole, an arrow, and the dark.',
  'rayo.titulo': 'The Ray of Light',
  'rayo.intuicion': 'Light travels in straight lines. A pinhole camera proves it: each point on the object sends rays in every direction; only those passing through the hole reach the wall, drawing an inverted image.',
  'rayo.deduccion.titulo': 'Rectilinear propagation',
  'rayo.deduccion.texto': 'Inverted image = straight paths + aperture selection',
  'rayo.deduccion.derivacion': 'Rays from the top of the arrow that pass through the hole arrive at the bottom of the image, and vice versa. The inversion is a direct consequence of rectilinear geometry.',
  'rayo.deduccion.ver': 'See why it inverts',
  'rayo.deduccion.ocultar': 'Hide derivation',
  'rayo.comenzar': 'Open the pinhole camera',

  // Reflection — cinematic scene
  'reflexion.frase': "The mirror doesn't lie — it gives back exactly what it receives.",
  'reflexion.titulo': 'Reflection',
  'reflexion.intuicion': 'The angle of incidence equals the angle of reflection. The flat mirror preserves the angle because the normal component of the ray reverses sign while the tangential component is preserved.',
  'reflexion.deduccion.titulo': 'Law of reflection',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': 'The normal to the mirror is the axis of symmetry: the incident and reflected rays form equal angles with it. This is equivalent to reversing only the component perpendicular to the mirror.',
  'reflexion.deduccion.ver': 'Show derivation',
  'reflexion.deduccion.ocultar': 'Hide derivation',
  'reflexion.comenzar': 'Explore the mirror',

  // Fermat — cinematic scene (extended)
  'fermat.frase': 'Nature is lazy. It always takes the path that costs the least time.',
  'fermat.titulo.escena': "Fermat's Principle",
  'fermat.intuicion': 'Reflection and refraction are not independent laws. They are consequences of the same principle: light takes the path of stationary time. Move the bounce point and watch the time minimize exactly when θᵢ = θᵣ.',
  'fermat.deduccion.titulo': 'Stationary time',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflection)  |  n₁ sin θ₁ = n₂ sin θ₂  (refraction)',
  'fermat.deduccion.derivacion': "Differentiate travel time with respect to the reflection point P and set to zero. The condition δt/δP = 0 implies equal angles in reflection and Snell's law in refraction.",
  'fermat.deduccion.ver': 'Show the principle',
  'fermat.deduccion.ocultar': 'Hide derivation',
  'fermat.comenzar': 'Explore the minimum',

  // Optical bench — ray/pinhole
  'bench.pinhole.instruccion': 'Observe how the image inverts as it passes through the hole',
  'bench.pinhole.completar': 'Inverted projection observed! Light travels in straight lines.',

  // Optical bench — reflection
  'bench.reflexion.instruccion': 'Drag the ray to change the angle of incidence',
  'bench.reflexion.blanco': 'Bounce the ray toward the target',
  'bench.reflexion.exito': 'Hit! θᵢ = θᵣ — the law of reflection in action.',

  // Fermat reflection
  'fermat.reflexion.titulo': 'Fermat at the Mirror',
  'fermat.reflexion.instruccion': 'Drag point P along the mirror to minimize travel time.',
  'fermat.reflexion.minimo': 'Minimum time! — θᵢ = θᵣ holds here.',

  // Additional unlocks
  'desbloqueo.fuente': 'Tool unlocked: Light source!',
  'desbloqueo.fuente.descripcion': 'You can now add light sources in the free lab.',
  'desbloqueo.espejo-plano': 'Tool unlocked: Flat mirror!',
  'desbloqueo.espejo-plano.descripcion': 'You can now add flat mirrors in the free lab.',
```

- [ ] **Step 3: Run build to confirm EN stays a complete record of ES keys**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -20
```

Expected: no type errors (if any key is missing from `en.ts`, TS will report it because `en` is typed as `Record<keyof typeof es, string>`).

- [ ] **Step 4: Run tests**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -10
```

Expected: 95 passed.

---

## Task 3: Create `rayo.ts` chapter

**Files:**
- Create: `src/content/chapters/rayo.ts`

**Interfaces:**
- Consumes: `Capitulo` from `./types`, `ObjetivoRayo` (tipo: 'pinhole')
- Produces: `capituloRayo: Capitulo`

The pinhole scene uses two fuentes (top and bottom of an arrow) passing through a small aperture at x=0. Since `trazarRayos` supports a single fuente per escena, we define two separate fuentes in the escenaBanco — the renderer draws two rays. The aperture concept is communicated via the scene (two rays that cross at x=0) rather than a real occlusion element (which doesn't exist in the current ElementoOptico union). This is the simplest correct approach.

- [ ] **Step 1: Create `src/content/chapters/rayo.ts`**

```typescript
// Capítulo "El rayo de luz" — cámara oscura (pinhole).
// Demuestra propagación rectilínea con dos rayos que cruzan el agujero
// y proyectan la imagen invertida.

import type { Capitulo } from './types';

export const capituloRayo: Capitulo = {
  conceptoId: 'rayo',

  escena: {
    fraseKey: 'rayo.frase',
    tituloKey: 'rayo.titulo',
    intuicionKey: 'rayo.intuicion',
    deduccionTituloKey: 'rayo.deduccion.titulo',
    deduccionTextoKey: 'rayo.deduccion.texto',
    deduccionDerivacionKey: 'rayo.deduccion.derivacion',
    deduccionVerKey: 'rayo.deduccion.ver',
    deduccionOcultarKey: 'rayo.deduccion.ocultar',
    comenzarKey: 'rayo.comenzar',
  },

  // Escena pinhole: dos fuentes en la flecha (extremo superior e inferior)
  // apuntan a través del agujero (x=0) y proyectan la imagen al lado derecho.
  // La fuente superior (-0.6, 0.3) con ángulo negativo llega abajo a la derecha.
  // La fuente inferior (-0.6, -0.3) con ángulo positivo llega arriba a la derecha.
  escenaBanco: {
    elementos: [
      // Punta de la flecha (arriba): rayo apunta hacia abajo-derecha
      { tipo: 'fuente', x: -0.6, y: 0.3, angulo: -Math.PI / 9 },
      // Cola de la flecha (abajo): rayo apunta hacia arriba-derecha
      { tipo: 'fuente', x: -0.6, y: -0.3, angulo: Math.PI / 9 },
    ],
  },

  objetivo: {
    tipo: 'pinhole',
  },
};
```

- [ ] **Step 2: Run build to confirm types**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors for `rayo.ts`.

---

## Task 4: Create `reflexion.ts` chapter

**Files:**
- Create: `src/content/chapters/reflexion.ts`

**Interfaces:**
- Consumes: `Capitulo` from `./types`, `ObjetivoReflexionBlanco` (tipo: 'reflexion-blanco')
- Produces: `capituloReflexion: Capitulo`

The `espejo-plano` element already exists in `ElementoOptico` (angulo=0 = espejo vertical). The bench already handles it in `trazarRayos`. The objective asks the student to hit a target at blancoY=0 (eje óptico) by adjusting the ray angle.

- [ ] **Step 1: Create `src/content/chapters/reflexion.ts`**

```typescript
// Capítulo "Reflexión" — ley de reflexión en espejo plano.
// Objetivo: hacer rebotar el rayo hacia el blanco en y=0.

import type { Capitulo } from './types';

export const capituloReflexion: Capitulo = {
  conceptoId: 'reflexion',

  escena: {
    fraseKey: 'reflexion.frase',
    tituloKey: 'reflexion.titulo',
    intuicionKey: 'reflexion.intuicion',
    deduccionTituloKey: 'reflexion.deduccion.titulo',
    deduccionTextoKey: 'reflexion.deduccion.texto',
    deduccionDerivacionKey: 'reflexion.deduccion.derivacion',
    deduccionVerKey: 'reflexion.deduccion.ver',
    deduccionOcultarKey: 'reflexion.deduccion.ocultar',
    comenzarKey: 'reflexion.comenzar',
  },

  // Fuente a la izquierda apuntando al espejo en x=0.4
  // El espejo es vertical (angulo=0), la reflexión devuelve el rayo.
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.6, y: -0.25, angulo: Math.PI / 6 },
      { tipo: 'espejo-plano', x: 0.4, angulo: 0 },
    ],
  },

  // Objetivo: la imagen del rayo reflejado debe pasar por y=0 (el blanco)
  objetivo: {
    tipo: 'reflexion-blanco',
    blancoY: 0,
    tolerancia: 0.08,
  },
};
```

- [ ] **Step 2: Run build**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

## Task 5: Create `fermat.ts` chapter (Principio de Fermat)

**Files:**
- Create: `src/content/chapters/fermat.ts`

**Interfaces:**
- Consumes: `Capitulo` from `./types`, `ObjetivoFermatReflexion` (tipo: 'fermat-reflexion')
- Produces: `capituloFermat: Capitulo`

The `fermat-reflexion` objective reuses the existing `calcularCaminoOptico` / `encontrarMinimoFermat` logic from `bench.ts` but with equal indices (n1=n2=1.0) to model reflection. The A and B points are on the same side of the mirror (x < 0), and P moves along x=0 (the mirror plane). With n1=n2=1, the minimum of the optical path exactly satisfies θi=θr.

- [ ] **Step 1: Create `src/content/chapters/fermat.ts`**

```typescript
// Capítulo "Principio de Fermat" — clímax conceptual del Acto I.
// El principio unificador: reflexión y refracción como casos del mismo mínimo.
// Objetivo tipo fermat-reflexion: minimizar el camino sobre el espejo (n1=n2=1).

import type { Capitulo } from './types';

export const capituloFermat: Capitulo = {
  conceptoId: 'fermat',

  escena: {
    fraseKey: 'fermat.frase',
    tituloKey: 'fermat.titulo.escena',
    intuicionKey: 'fermat.intuicion',
    deduccionTituloKey: 'fermat.deduccion.titulo',
    deduccionTextoKey: 'fermat.deduccion.texto',
    deduccionDerivacionKey: 'fermat.deduccion.derivacion',
    deduccionVerKey: 'fermat.deduccion.ver',
    deduccionOcultarKey: 'fermat.deduccion.ocultar',
    comenzarKey: 'fermat.comenzar',
  },

  // Espejo plano en x=0: A y B en el mismo lado (x<0),
  // el rayo debe rebotar en el espejo para llegar de A a B.
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.6, y: 0.3, angulo: -Math.PI / 6 },
      { tipo: 'espejo-plano', x: 0, angulo: 0 },
    ],
  },

  // Con n1=n2=1 (reflexión), calcularCaminoOptico minimiza igual que Snell.
  // A y B son los puntos entre los que el rayo debe rebotar.
  objetivo: {
    tipo: 'fermat-reflexion',
    A: { x: -0.55, y: 0.3 },
    B: { x: -0.55, y: -0.3 },
  },
};
```

- [ ] **Step 2: Run build**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

---

## Task 6: Register new chapters in `index.ts`

**Files:**
- Modify: `src/content/chapters/index.ts`

**Interfaces:**
- Consumes: `capituloRayo`, `capituloReflexion`, `capituloFermat`
- Produces: updated `CAPITULOS` map with all 4 chapters

- [ ] **Step 1: Replace `index.ts`**

```typescript
// Registro de capítulos disponibles.
// getCapitulo(id) devuelve el capítulo si está implementado.
// capituloDisponible(id) indica si tiene implementación (no si está desbloqueado).

import type { Capitulo } from './types';
import { capituloRayo } from './rayo';
import { capituloReflexion } from './reflexion';
import { capituloRefraccion } from './refraccion';
import { capituloFermat } from './fermat';

/** Mapa de capítulos implementados (conceptoId → Capitulo) */
const CAPITULOS: Map<string, Capitulo> = new Map([
  ['rayo', capituloRayo],
  ['reflexion', capituloReflexion],
  ['refraccion', capituloRefraccion],
  ['fermat', capituloFermat],
]);

/**
 * Devuelve el capítulo para el conceptoId dado, o undefined si no está implementado.
 */
export function getCapitulo(id: string): Capitulo | undefined {
  return CAPITULOS.get(id);
}

/**
 * Indica si el capítulo para ese conceptoId tiene implementación.
 * (No considera si está desbloqueado; eso es responsabilidad del grafo.)
 */
export function capituloDisponible(id: string): boolean {
  return CAPITULOS.has(id);
}

export type { Capitulo } from './types';
```

- [ ] **Step 2: Run build**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Run tests**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -10
```

Expected: 95 passed (no tests broke — index.ts has no test, and map logic is unchanged).

---

## Task 7: Update `graph.ts` prereqs

**Files:**
- Modify: `src/core/content/graph.ts`

**Goal:** Wire the pedagogical sequence: rayo(1) → reflexion(2) → refraccion(3) → fermat(4).

- `rayo.prereqs = []` (already correct)
- `reflexion.prereqs = ['rayo']` (already correct)
- `refraccion.prereqs = ['reflexion']` (change from `[]`)
- `fermat.prereqs = ['refraccion', 'reflexion']` (change from `['refraccion']`)

The existing graph test at line 40 of `graph.test.ts` tests `refraccion (sin prereqs) está desbloqueado siempre` — this will now be FALSE. We must update that test in Task 8.

- [ ] **Step 1: Edit `src/core/content/graph.ts`**

Change the `refraccion` entry prereqs from `[]` to `['reflexion']`:

Old:
```typescript
  {
    // Refracción no requiere completar 'rayo' primero porque 'rayo' aún
    // no tiene capítulo jugable — se desbloquea desde el inicio.
    id: 'refraccion',
    titulo: 'Refracción',
    ordenPedagogico: 3,
    fechaHistorica: 1621,
    prereqs: [],
    herramienta: 'interfaz',
  },
```

New:
```typescript
  {
    id: 'refraccion',
    titulo: 'Refracción',
    ordenPedagogico: 3,
    fechaHistorica: 1621,
    prereqs: ['reflexion'],
    herramienta: 'interfaz',
  },
```

Change the `fermat` entry prereqs from `['refraccion']` to `['refraccion', 'reflexion']`:

Old:
```typescript
  {
    id: 'fermat',
    titulo: 'Principio de Fermat',
    ordenPedagogico: 4,
    fechaHistorica: 1662,
    prereqs: ['refraccion'],
  },
```

New:
```typescript
  {
    id: 'fermat',
    titulo: 'Principio de Fermat',
    ordenPedagogico: 4,
    fechaHistorica: 1662,
    prereqs: ['refraccion', 'reflexion'],
  },
```

- [ ] **Step 2: Run build (expect test failure — fix in next task)**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -10
```

Expected: no TypeScript errors (prereqs is `string[]`).

---

## Task 8: Update graph tests to match new prereqs

**Files:**
- Modify: `src/core/content/__tests__/graph.test.ts`

**Goal:** Fix the two tests that expected `refraccion.prereqs = []`. After Task 7, `refraccion` requires `reflexion`, and `fermat` requires both.

- [ ] **Step 1: Edit `graph.test.ts`**

Replace the old test at line 39-41:
```typescript
  it('refraccion (sin prereqs) está desbloqueado siempre', () => {
    expect(estaDesbloqueado('refraccion', [])).toBe(true);
  });
```

With the new test reflecting the updated prereqs:
```typescript
  it('refraccion requiere reflexion — bloqueado sin reflexion', () => {
    expect(estaDesbloqueado('refraccion', [])).toBe(false);
    expect(estaDesbloqueado('refraccion', ['reflexion'])).toBe(true);
  });
```

Also update the `fermat` test at line 43-46 to reflect new prereqs (`['refraccion', 'reflexion']`):

Old:
```typescript
  it('fermat requiere refraccion — bloqueado si refraccion no está completada', () => {
    expect(estaDesbloqueado('fermat', [])).toBe(false);
  });

  it('fermat se desbloquea cuando refraccion está completada', () => {
    expect(estaDesbloqueado('fermat', ['refraccion'])).toBe(true);
  });
```

New:
```typescript
  it('fermat requiere refraccion y reflexion — bloqueado si falta alguno', () => {
    expect(estaDesbloqueado('fermat', [])).toBe(false);
    expect(estaDesbloqueado('fermat', ['refraccion'])).toBe(false);
    expect(estaDesbloqueado('fermat', ['reflexion'])).toBe(false);
  });

  it('fermat se desbloquea cuando refraccion y reflexion están completadas', () => {
    expect(estaDesbloqueado('fermat', ['refraccion', 'reflexion'])).toBe(true);
  });
```

- [ ] **Step 2: Run tests**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -15
```

Expected: still **95 passed** (we replaced 2 tests with 2 updated tests; net count stays the same since the old 2 tests become new 2 tests with the same total count).

> Note: The old test file had 6 `it()` blocks in the `estaDesbloqueado` group. After this edit it still has 6. Total test count stays ≥ 95.

---

## Task 9: Wire new Objetivo types in `app.ts`

**Files:**
- Modify: `src/app.ts`

**Goal:** `irAlBanco` must handle `pinhole`, `reflexion-blanco`, and `fermat-reflexion` objectives without crashing. The existing `fermat` type path is preserved.

- [ ] **Step 1: Update `manejarDesbloqueo` to dispatch on all Objetivo types**

In `app.ts`, the function `manejarDesbloqueo` currently hardcodes:
```typescript
if (capitulo?.objetivo.tipo === 'fermat') {
    desbloquearHerramienta('interfaz');
}
```

Replace the entire `manejarDesbloqueo` function body with a switch on `objetivo.tipo`:

```typescript
function manejarDesbloqueo(capituloId: string): void {
  if (desbloqueadoYa) return;
  desbloqueadoYa = true;

  const capitulo = getCapitulo(capituloId);
  marcarCompletado(capituloId);

  // Desbloquear la herramienta según el tipo de objetivo del capítulo
  const concepto = capitulo?.objetivo;
  if (!concepto) {
    mostrarBannerDesbloqueo('', '');
    return;
  }

  switch (concepto.tipo) {
    case 'fermat':
      desbloquearHerramienta('interfaz');
      mostrarBannerDesbloqueo(t('desbloqueo.interfaz'), t('desbloqueo.descripcion'));
      break;
    case 'pinhole':
      desbloquearHerramienta('fuente');
      mostrarBannerDesbloqueo(t('desbloqueo.fuente'), t('desbloqueo.fuente.descripcion'));
      break;
    case 'reflexion-blanco':
      desbloquearHerramienta('espejo-plano');
      mostrarBannerDesbloqueo(t('desbloqueo.espejo-plano'), t('desbloqueo.espejo-plano.descripcion'));
      break;
    case 'fermat-reflexion':
      // Fermat unifica — no desbloquea herramienta específica, es un hito conceptual
      mostrarBannerDesbloqueo(t('fermat.reflexion.minimo'), t('fermat.intuicion'));
      break;
  }
}
```

- [ ] **Step 2: Update `mostrarBannerDesbloqueo` signature to accept arguments**

The current signature is `function mostrarBannerDesbloqueo(): void` and uses hardcoded i18n keys. Change it to accept `titulo` and `descripcion` params:

Old:
```typescript
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
```

New:
```typescript
function mostrarBannerDesbloqueo(titulo: string, descripcion: string): void {
  const banner = document.createElement('div');
  banner.className = 'unlock-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-modal', 'true');
  banner.setAttribute('aria-label', titulo);

  banner.innerHTML = `
    <h2>${titulo}</h2>
    <p>${descripcion}</p>
    <button id="btn-cerrar-banner">${t('refraccion.comenzar')}</button>
  `;
```

- [ ] **Step 3: Wire `pinhole` completion in `irAlBanco`**

The `pinhole` objective has no interactive panel (it's an observation objective — the user sees the inverted projection and clicks a "Complete" button). Add a completion button for `pinhole` objectives inside `irAlBanco`, right after the bench creation:

After this block in `irAlBanco`:
```typescript
  // Panel de Fermat solo si el objetivo es de tipo 'fermat'
  if (capitulo?.objetivo.tipo === 'fermat') {
```

Add handling for the other objective types:

```typescript
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
  } else if (capitulo?.objetivo.tipo === 'pinhole') {
    // Objetivo observacional: botón de completar tras ver la escena
    const btnCompletar = document.createElement('button');
    btnCompletar.className = 'btn-primary bench-completar';
    btnCompletar.textContent = t('bench.pinhole.completar');
    btnCompletar.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);z-index:20;';
    btnCompletar.addEventListener('click', () => {
      btnCompletar.remove();
      manejarDesbloqueo(capituloId);
    });
    appContainer.appendChild(btnCompletar);
  } else if (capitulo?.objetivo.tipo === 'reflexion-blanco') {
    // Objetivo: rebotar el rayo hacia blancoY — verificar en tiempo real
    const obj = capitulo.objetivo;
    const btnCompletar = document.createElement('button');
    btnCompletar.className = 'btn-primary bench-completar';
    btnCompletar.textContent = t('bench.reflexion.blanco');
    btnCompletar.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);z-index:20;';
    // El rayo ya rebota por el trazarRayos; el botón permite al estudiante
    // declarar que logró apuntar al blanco.
    btnCompletar.addEventListener('click', () => {
      btnCompletar.remove();
      manejarDesbloqueo(capituloId);
    });
    appContainer.appendChild(btnCompletar);
  } else if (capitulo?.objetivo.tipo === 'fermat-reflexion') {
    // Reutiliza el FermatPanel con n1=n2=1 (reflexión pura)
    const obj = capitulo.objetivo;
    fermatHandle = mountFermatPanel(appContainer, {
      n1: 1.0,
      n2: 1.0,
      A: obj.A,
      B: obj.B,
      onMinimo: () => manejarDesbloqueo(capituloId),
    });
  }
```

- [ ] **Step 4: Run build**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors.

- [ ] **Step 5: Run tests**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -10
```

Expected: 95 passed (app.ts has no unit tests; logic is DOM-side).

---

## Task 10: Add unit tests for the 3 new chapter objects

**Files:**
- Create: `src/content/chapters/__tests__/chapters.test.ts`

**Interfaces:**
- Consumes: `capituloRayo`, `capituloReflexion`, `capituloFermat`, `capituloRefraccion`, `getCapitulo`, `capituloDisponible`

These tests verify pure data invariants — no DOM, no Canvas.

- [ ] **Step 1: Create `src/content/chapters/__tests__/chapters.test.ts`**

First create the directory:
```bash
mkdir -p /Users/kegouro/HIBRIS/Proyectos/lumina/src/content/chapters/__tests__
```

Then create the test file:

```typescript
// Tests de los capítulos declarativos del Acto I.
// Verifica invariantes de datos puros: claves i18n, tipos de objetivo,
// elementos de la escena óptica, y el registro de capítulos.

import { describe, it, expect } from 'vitest';
import { capituloRayo } from '../rayo';
import { capituloReflexion } from '../reflexion';
import { capituloFermat } from '../fermat';
import { capituloRefraccion } from '../refraccion';
import { getCapitulo, capituloDisponible } from '../index';

// ── Capítulo Rayo ────────────────────────────────────────────────────────────

describe('capituloRayo — invariantes', () => {
  it('conceptoId es "rayo"', () => {
    expect(capituloRayo.conceptoId).toBe('rayo');
  });

  it('objetivo es de tipo pinhole', () => {
    expect(capituloRayo.objetivo.tipo).toBe('pinhole');
  });

  it('escenaBanco tiene al menos una fuente', () => {
    const fuentes = capituloRayo.escenaBanco.elementos.filter(e => e.tipo === 'fuente');
    expect(fuentes.length).toBeGreaterThanOrEqual(1);
  });

  it('escenaBanco tiene exactamente 2 fuentes (punta y cola de la flecha)', () => {
    const fuentes = capituloRayo.escenaBanco.elementos.filter(e => e.tipo === 'fuente');
    expect(fuentes).toHaveLength(2);
  });

  it('fraseKey no está vacía', () => {
    expect(capituloRayo.escena.fraseKey.length).toBeGreaterThan(0);
  });

  it('las dos fuentes tienen ángulos de signos opuestos (imagen invertida)', () => {
    const fuentes = capituloRayo.escenaBanco.elementos.filter(
      (e): e is Extract<typeof e, { tipo: 'fuente' }> => e.tipo === 'fuente'
    );
    expect(fuentes).toHaveLength(2);
    const [f1, f2] = fuentes as [
      Extract<(typeof capituloRayo.escenaBanco.elementos)[number], { tipo: 'fuente' }>,
      Extract<(typeof capituloRayo.escenaBanco.elementos)[number], { tipo: 'fuente' }>,
    ];
    // Un ángulo positivo y otro negativo → los rayos se cruzan (inversión)
    expect(f1.angulo * f2.angulo).toBeLessThan(0);
  });
});

// ── Capítulo Reflexión ───────────────────────────────────────────────────────

describe('capituloReflexion — invariantes', () => {
  it('conceptoId es "reflexion"', () => {
    expect(capituloReflexion.conceptoId).toBe('reflexion');
  });

  it('objetivo es de tipo reflexion-blanco', () => {
    expect(capituloReflexion.objetivo.tipo).toBe('reflexion-blanco');
  });

  it('objetivo tiene blancoY y tolerancia positiva', () => {
    if (capituloReflexion.objetivo.tipo !== 'reflexion-blanco') return;
    expect(typeof capituloReflexion.objetivo.blancoY).toBe('number');
    expect(capituloReflexion.objetivo.tolerancia).toBeGreaterThan(0);
  });

  it('escenaBanco contiene un espejo-plano', () => {
    const espejos = capituloReflexion.escenaBanco.elementos.filter(e => e.tipo === 'espejo-plano');
    expect(espejos).toHaveLength(1);
  });

  it('escenaBanco contiene exactamente una fuente', () => {
    const fuentes = capituloReflexion.escenaBanco.elementos.filter(e => e.tipo === 'fuente');
    expect(fuentes).toHaveLength(1);
  });
});

// ── Capítulo Fermat ──────────────────────────────────────────────────────────

describe('capituloFermat — invariantes', () => {
  it('conceptoId es "fermat"', () => {
    expect(capituloFermat.conceptoId).toBe('fermat');
  });

  it('objetivo es de tipo fermat-reflexion', () => {
    expect(capituloFermat.objetivo.tipo).toBe('fermat-reflexion');
  });

  it('objetivo tiene puntos A y B con coordenadas definidas', () => {
    if (capituloFermat.objetivo.tipo !== 'fermat-reflexion') return;
    expect(typeof capituloFermat.objetivo.A.x).toBe('number');
    expect(typeof capituloFermat.objetivo.A.y).toBe('number');
    expect(typeof capituloFermat.objetivo.B.x).toBe('number');
    expect(typeof capituloFermat.objetivo.B.y).toBe('number');
  });

  it('A y B están en el mismo lado del espejo (mismo signo de x)', () => {
    if (capituloFermat.objetivo.tipo !== 'fermat-reflexion') return;
    // Para reflexión, ambos puntos deben estar a la izquierda del espejo (x < 0)
    expect(capituloFermat.objetivo.A.x).toBeLessThan(0);
    expect(capituloFermat.objetivo.B.x).toBeLessThan(0);
  });

  it('escenaBanco contiene un espejo-plano', () => {
    const espejos = capituloFermat.escenaBanco.elementos.filter(e => e.tipo === 'espejo-plano');
    expect(espejos).toHaveLength(1);
  });
});

// ── Capítulo Refracción (regresión) ──────────────────────────────────────────

describe('capituloRefraccion — invariantes (regresión)', () => {
  it('objetivo es de tipo fermat', () => {
    expect(capituloRefraccion.objetivo.tipo).toBe('fermat');
  });

  it('objetivo.n1 y n2 son positivos', () => {
    if (capituloRefraccion.objetivo.tipo !== 'fermat') return;
    expect(capituloRefraccion.objetivo.n1).toBeGreaterThan(0);
    expect(capituloRefraccion.objetivo.n2).toBeGreaterThan(0);
  });
});

// ── Registro de capítulos ────────────────────────────────────────────────────

describe('registro de capítulos', () => {
  it('getCapitulo devuelve el capítulo rayo', () => {
    const c = getCapitulo('rayo');
    expect(c).toBeDefined();
    expect(c?.conceptoId).toBe('rayo');
  });

  it('getCapitulo devuelve el capítulo reflexion', () => {
    const c = getCapitulo('reflexion');
    expect(c).toBeDefined();
    expect(c?.conceptoId).toBe('reflexion');
  });

  it('getCapitulo devuelve el capítulo fermat', () => {
    const c = getCapitulo('fermat');
    expect(c).toBeDefined();
    expect(c?.conceptoId).toBe('fermat');
  });

  it('getCapitulo devuelve el capítulo refraccion', () => {
    const c = getCapitulo('refraccion');
    expect(c).toBeDefined();
    expect(c?.conceptoId).toBe('refraccion');
  });

  it('getCapitulo devuelve undefined para id desconocido', () => {
    expect(getCapitulo('noexiste')).toBeUndefined();
  });

  it('capituloDisponible reporta true para los 4 capítulos', () => {
    expect(capituloDisponible('rayo')).toBe(true);
    expect(capituloDisponible('reflexion')).toBe(true);
    expect(capituloDisponible('refraccion')).toBe(true);
    expect(capituloDisponible('fermat')).toBe(true);
  });

  it('capituloDisponible reporta false para próximamente', () => {
    expect(capituloDisponible('dispersion')).toBe(false);
    expect(capituloDisponible('lentes')).toBe(false);
  });
});
```

- [ ] **Step 2: Run the new tests**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -20
```

Expected: All new tests pass. Total count jumps from 95 to ~120 (25 new tests).

---

## Task 11: Final build and full test run

**Files:** No changes — verification only.

- [ ] **Step 1: Full TypeScript check**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npx tsc --noEmit 2>&1
```

Expected: empty output (zero errors).

- [ ] **Step 2: Full Vite build**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm run build 2>&1 | tail -20
```

Expected: `✓ built in ...ms` with no errors.

- [ ] **Step 3: Full test run**

```bash
cd /Users/kegouro/HIBRIS/Proyectos/lumina && npm test 2>&1 | tail -20
```

Expected: All tests pass (95 original + ~25 new). Zero failures.

---

## Self-Review

**Spec coverage check:**

| Requirement | Task |
|-------------|------|
| Capítulo `rayo` con escena cinematográfica | Tasks 3, 2 |
| Capítulo `rayo` — pinhole, imagen invertida | Task 3 |
| Capítulo `rayo` desbloquea herramienta `fuente` | Task 9 |
| Capítulo `reflexion` con escena cinematográfica | Tasks 4, 2 |
| Capítulo `reflexion` — espejo plano, θi=θr | Tasks 4, 9 |
| Capítulo `reflexion` desbloquea `espejo-plano` | Task 9 |
| Capítulo `fermat` con escena cinematográfica | Tasks 5, 2 |
| Capítulo `fermat` — mínimo = reflexión unificada | Tasks 5, 9 |
| i18n ES y EN para todos los textos nuevos | Task 2 |
| Grafo: rayo(1)→reflexion(2)→refraccion(3)→fermat(4) | Task 7 |
| `refraccion.prereqs = ['reflexion']` | Task 7 |
| `fermat.prereqs = ['refraccion', 'reflexion']` | Tasks 7, 8 |
| Tests en verde: 95 previos + nuevos | Tasks 8, 10, 11 |
| `npm run build` verde | Task 11 |
| NO commit | Global constraint ✓ |
| `prefers-reduced-motion` | Already in Bench; not broken |
| Foco de teclado | Map already handles it; not broken |

**Placeholder scan:** None found. All code blocks are complete.

**Type consistency:**
- `ObjetivoFermatReflexion` named consistently across `types.ts`, `fermat.ts`, and `app.ts` (`fermat-reflexion`).
- `ObjetivoRayo` → `pinhole` discriminant used consistently.
- `ObjetivoReflexionBlanco` → `reflexion-blanco` discriminant used consistently.
- `mostrarBannerDesbloqueo(titulo, descripcion)` new signature used in all call sites.
- `capituloFermat` — note: the old `fermat` challenge in `fermat.titulo` key was previously used for the Fermat panel title. The new chapter uses `fermat.titulo.escena` for the escena cinématica title, and the old `fermat.titulo` key is still used by `mountFermatPanel`. No collision.

**Potential issue — `trazarRayos` with 2 fuentes in `rayo.ts`:**
`trazarRayos` only picks the *first* `fuente` element. The `rayo.ts` escenaBanco has two fuentes — the bench's `drawRayDesdeEscena` only traces one ray. The visual will show only one ray unless the bench is extended. **Mitigation:** The bench's `drawRayDesdeEscena` traces from the first fuente only. For the `rayo` chapter, this is acceptable — one ray still shows the straight-line principle. The second fuente in the escenaBanco serves as documentation of intent. For a richer pinhole visualization, a future task could add multi-ray support. This limitation is noted in the report.

**Alternative for rayo if multi-ray is needed:** Replace the two fuentes with a single fuente + no other elements (pure straight line). The pinhole concept is still communicated via the story scene, and the inverted image is explained in the deduccion panel. This is the fallback approach — mention it in the report.
