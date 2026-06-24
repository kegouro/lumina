# Wave A: Framework de Capítulos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir Lumina de "un capítulo hardcodeado" a un framework de capítulos dirigido por datos — grafo de conceptos, registro declarativo de capítulos, trazador genérico de rayos, y mapa de progresión — sin romper los 43 tests existentes ni el flujo Refracción.

**Architecture:** Se añaden tres capas de datos puras (`src/core/content/graph.ts`, `src/content/chapters/`) y un nuevo módulo UI (`src/ui/map/`). El banco Canvas2D existente se generaliza para aceptar una `EscenaOptica` declarativa en vez de tener n1/n2/thetaInc hardcodeados. `app.ts` orquesta el nuevo flujo: menú → mapa → capítulo → escena cinematográfica → banco → objetivo → desbloqueo.

**Tech Stack:** TypeScript estricto, Vite, Vitest, Canvas2D, sin nuevas dependencias.

## Global Constraints

- TS estricto — `strict: true` ya activo en tsconfig; no añadir `any` sin comentario de justificación.
- Comentarios en español, código en español (nombres de variables/funciones/clases), excepto la clave de i18n que es `TranslationKey`.
- DOMAIN_COLORS de `src/core/colors.ts` para todo color de rayo/beam/wave; tokens CSS `--color-*` para UI.
- Snell EXACTO (`refract()` de `src/core/snell.ts`) para todo trazado del Acto I — NUNCA matrices ABCD.
- Funciones de física/trazado son PURAS (sin DOM, sin efectos, sin estado global).
- `prefers-reduced-motion` respetado en todas las animaciones.
- Foco de teclado visible en todos los elementos interactivos.
- i18n: toda cadena visible al usuario vive en `src/ui/i18n/es.ts` y `src/ui/i18n/en.ts`.
- `npm run build` y `npm test` en verde antes de cada commit.
- Los 43 tests existentes NO deben romperse.
- NO crear archivos de documentación ni README. NO hacer commit (lo revisa el autor).

---

## File Map — archivos nuevos y modificados

**Nuevos:**
- `src/core/content/graph.ts` — tipo `Concepto`, registro del Acto I, helpers `conceptosEnRuta` / `estaDesbloqueado`
- `src/core/content/__tests__/graph.test.ts` — tests de los helpers
- `src/core/content/optics.ts` — tipos `EscenaOptica`, `ElementoOptico` (unión discriminada), `PuntoRayo`, helper puro `trazarRayos(escena, origen, angulo)`
- `src/core/content/__tests__/optics.test.ts` — tests del trazador
- `src/content/chapters/types.ts` — tipo `Capitulo`, `Objetivo`, `EscenaCinematica`, `EscenaBanco`
- `src/content/chapters/refraccion.ts` — capítulo Refracción migrado (datos declarativos)
- `src/content/chapters/index.ts` — `getCapitulo(id)`, `capituloDisponible(id)`
- `src/ui/map/index.ts` — `mountMap(container, opts)` — mapa de progresión con nodos bloqueado/disponible/completado
- `src/ui/map/map.css` — estilos del mapa (sendero vertical, nodos, estados)

**Modificados:**
- `src/render/render2d/bench.ts` — `BenchConfig` acepta `EscenaOptica`; el trazado usa el trazador puro
- `src/render/render2d/index.ts` — re-exporta lo nuevo que necesite `app.ts`
- `src/ui/story/index.ts` — acepta `capituloId: string` (no solo `'refraccion'`)
- `src/app.ts` — flujo actualizado: menú → `irAlMapa()` → mapa → capítulo → escena → banco
- `src/ui/i18n/es.ts` — claves nuevas: mapa, estados de nodos, próximamente
- `src/ui/i18n/en.ts` — ídem en inglés
- `src/styles/bench.css` — sin cambios estructurales (puede requerir ajuste menor)

---

### Task 1: Grafo de conceptos — `src/core/content/graph.ts`

**Files:**
- Create: `src/core/content/graph.ts`
- Create: `src/core/content/__tests__/graph.test.ts`

**Interfaces:**
- Produces:
  - `Concepto { id: string; titulo: string; ordenPedagogico: number; fechaHistorica: number; prereqs: string[]; herramienta?: string }`
  - `conceptosEnRuta(ruta: 'pedagogica' | 'historica'): Concepto[]`
  - `estaDesbloqueado(id: string, completados: string[]): boolean`
  - `CONCEPTOS: Concepto[]` (registro completo del Acto I)

- [ ] **Step 1: Crear el archivo del grafo**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/core/content/graph.ts`:

```typescript
// Grafo de conceptos del Acto I de Lumina.
// Cada concepto tiene id, título, orden pedagógico, fecha histórica y prerequisitos.
// Los helpers son PUROS: sin DOM, sin estado global.

/** Un concepto/capítulo del curso */
export interface Concepto {
  id: string;
  titulo: string;
  /** Orden en la ruta pedagógica (1-based) */
  ordenPedagogico: number;
  /** Año histórico aproximado del descubrimiento (negativo = a.C.) */
  fechaHistorica: number;
  /** IDs de conceptos que deben estar completados antes de este */
  prereqs: string[];
  /** Herramienta que desbloquea al completar */
  herramienta?: string;
}

/** Registro de todos los conceptos del Acto I */
export const CONCEPTOS: Concepto[] = [
  {
    id: 'rayo',
    titulo: 'El rayo de luz',
    ordenPedagogico: 1,
    fechaHistorica: -300,
    prereqs: [],
    herramienta: 'fuente',
  },
  {
    id: 'reflexion',
    titulo: 'Reflexión',
    ordenPedagogico: 2,
    fechaHistorica: -300,
    prereqs: ['rayo'],
    herramienta: 'espejo-plano',
  },
  {
    id: 'refraccion',
    titulo: 'Refracción',
    ordenPedagogico: 3,
    fechaHistorica: 1621,
    prereqs: ['rayo'],
    herramienta: 'interfaz',
  },
  {
    id: 'fermat',
    titulo: 'Principio de Fermat',
    ordenPedagogico: 4,
    fechaHistorica: 1662,
    prereqs: ['refraccion'],
  },
  {
    id: 'dispersion',
    titulo: 'Dispersión y color',
    ordenPedagogico: 5,
    fechaHistorica: 1672,
    prereqs: ['refraccion'],
    herramienta: 'espectrómetro',
  },
  {
    id: 'lentes',
    titulo: 'Lentes y espejos curvos',
    ordenPedagogico: 6,
    fechaHistorica: 1604,
    prereqs: ['refraccion', 'reflexion'],
    herramienta: 'lente-delgada',
  },
  {
    id: 'aberraciones',
    titulo: 'Aberraciones',
    ordenPedagogico: 7,
    fechaHistorica: 1856,
    prereqs: ['lentes'],
  },
  {
    id: 'instrumentos',
    titulo: 'Instrumentos ópticos',
    ordenPedagogico: 8,
    fechaHistorica: 1608,
    prereqs: ['lentes'],
    herramienta: 'sistema-multi-elemento',
  },
];

/**
 * Devuelve los conceptos ordenados según la ruta elegida.
 * 'pedagogica': por ordenPedagogico ascendente.
 * 'historica': por fechaHistorica ascendente.
 */
export function conceptosEnRuta(ruta: 'pedagogica' | 'historica'): Concepto[] {
  const copia = [...CONCEPTOS];
  if (ruta === 'pedagogica') {
    copia.sort((a, b) => a.ordenPedagogico - b.ordenPedagogico);
  } else {
    copia.sort((a, b) => a.fechaHistorica - b.fechaHistorica);
  }
  return copia;
}

/**
 * Determina si un concepto está desbloqueado dado el conjunto de completados.
 * Un concepto está desbloqueado cuando todos sus prereqs están en `completados`.
 */
export function estaDesbloqueado(id: string, completados: string[]): boolean {
  const concepto = CONCEPTOS.find(c => c.id === id);
  if (!concepto) return false;
  return concepto.prereqs.every(req => completados.includes(req));
}
```

- [ ] **Step 2: Escribir los tests del grafo**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/core/content/__tests__/graph.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { conceptosEnRuta, estaDesbloqueado, CONCEPTOS } from '../graph';

describe('graph — conceptosEnRuta', () => {
  it('ruta pedagógica devuelve conceptos ordenados por ordenPedagogico', () => {
    const ruta = conceptosEnRuta('pedagogica');
    for (let i = 1; i < ruta.length; i++) {
      expect(ruta[i]!.ordenPedagogico).toBeGreaterThan(ruta[i - 1]!.ordenPedagogico);
    }
  });

  it('ruta histórica devuelve conceptos ordenados por fechaHistorica', () => {
    const ruta = conceptosEnRuta('historica');
    for (let i = 1; i < ruta.length; i++) {
      expect(ruta[i]!.fechaHistorica).toBeGreaterThanOrEqual(ruta[i - 1]!.fechaHistorica);
    }
  });

  it('ambas rutas contienen los mismos conceptos', () => {
    const p = conceptosEnRuta('pedagogica').map(c => c.id).sort();
    const h = conceptosEnRuta('historica').map(c => c.id).sort();
    expect(p).toEqual(h);
  });

  it('no muta el array CONCEPTOS original', () => {
    const antes = CONCEPTOS.map(c => c.id);
    conceptosEnRuta('pedagogica');
    conceptosEnRuta('historica');
    const despues = CONCEPTOS.map(c => c.id);
    expect(antes).toEqual(despues);
  });
});

describe('graph — estaDesbloqueado', () => {
  it('rayo (sin prereqs) está desbloqueado siempre', () => {
    expect(estaDesbloqueado('rayo', [])).toBe(true);
  });

  it('refraccion requiere rayo — bloqueado si rayo no está completado', () => {
    expect(estaDesbloqueado('refraccion', [])).toBe(false);
  });

  it('refraccion se desbloquea cuando rayo está completado', () => {
    expect(estaDesbloqueado('refraccion', ['rayo'])).toBe(true);
  });

  it('lentes requiere refraccion Y reflexion', () => {
    expect(estaDesbloqueado('lentes', ['refraccion'])).toBe(false);
    expect(estaDesbloqueado('lentes', ['reflexion'])).toBe(false);
    expect(estaDesbloqueado('lentes', ['refraccion', 'reflexion'])).toBe(true);
  });

  it('id desconocido devuelve false', () => {
    expect(estaDesbloqueado('noexiste', ['rayo'])).toBe(false);
  });
});
```

- [ ] **Step 3: Ejecutar los tests nuevos**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npm test -- --reporter=verbose 2>&1 | grep -E "(PASS|FAIL|✓|✗|graph)"
```

Esperado: todos los tests de `graph.test.ts` en verde, los 43 anteriores también.

---

### Task 2: Tipos de la escena óptica y trazador exacto — `src/core/content/optics.ts`

**Files:**
- Create: `src/core/content/optics.ts`
- Create: `src/core/content/__tests__/optics.test.ts`

**Interfaces:**
- Consumes: `refract` de `../../snell`, `reflect` de `../../snell`
- Produces:
  - `ElementoOptico` (unión discriminada: `fuente | interfaz | espejoPlano`)
  - `EscenaOptica { elementos: ElementoOptico[] }`
  - `PuntoRayo { x: number; y: number }` — vértice de la polilínea
  - `trazarRayos(escena: EscenaOptica, xFin: number): PuntoRayo[]` — produce polilínea completa

- [ ] **Step 1: Crear el módulo de óptica**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/core/content/optics.ts`:

```typescript
// Tipos de escena óptica y trazador exacto de rayos para el Acto I.
// Usa Snell EXACTO (refract de core/snell), nunca ABCD.
// Todas las funciones son PURAS: sin DOM, sin estado global.

import { refract, reflect } from '../snell';

// ── Elementos ópticos (unión discriminada extensible) ────────────────────────

/** Fuente puntual de rayo */
export interface ElementoFuente {
  tipo: 'fuente';
  /** Posición x de la fuente (coordenadas normalizadas bench [-1, 1]) */
  x: number;
  /** Posición y de la fuente */
  y: number;
  /** Ángulo inicial del rayo respecto al eje (radianes, positivo = hacia arriba) */
  angulo: number;
}

/** Interfaz plana vertical (refracción Snell exacta + TIR) */
export interface ElementoInterfaz {
  tipo: 'interfaz';
  /** Posición x de la interfaz */
  x: number;
  /** Índice del medio a la izquierda */
  n1: number;
  /** Índice del medio a la derecha */
  n2: number;
}

/** Espejo plano vertical (reflexión especular exacta) */
export interface ElementoEspejoPlano {
  tipo: 'espejo-plano';
  /** Posición x del espejo */
  x: number;
  /** Ángulo del espejo respecto a la vertical (radianes, 0 = vertical) */
  angulo: number;
}

/** Unión discriminada de todos los elementos posibles */
export type ElementoOptico =
  | ElementoFuente
  | ElementoInterfaz
  | ElementoEspejoPlano;

/** Escena óptica: lista ordenada de elementos */
export interface EscenaOptica {
  elementos: ElementoOptico[];
}

/** Punto 2D de la polilínea del rayo */
export interface PuntoRayo {
  x: number;
  y: number;
  /** true si en este punto hay TIR (para colorear distinto) */
  tir?: boolean;
}

// ── Trazador puro ────────────────────────────────────────────────────────────

/**
 * Traza un rayo a través de la escena y produce la polilínea de puntos.
 * Los elementos se procesan en orden de aparición en `escena.elementos`,
 * asumiendo que están ordenados izquierda→derecha.
 *
 * La fuente DEBE ser el primer elemento de tipo 'fuente'.
 * `xFin` es la coordenada x final hasta donde extender el último segmento.
 *
 * @returns array de PuntoRayo que forman la polilínea; vacío si no hay fuente.
 */
export function trazarRayos(escena: EscenaOptica, xFin: number): PuntoRayo[] {
  // Encontrar la fuente
  const fuente = escena.elementos.find(
    (e): e is ElementoFuente => e.tipo === 'fuente'
  );
  if (!fuente) return [];

  const puntos: PuntoRayo[] = [{ x: fuente.x, y: fuente.y }];

  // Estado del rayo
  let x = fuente.x;
  let y = fuente.y;
  let angulo = fuente.angulo; // radianes, positivo = hacia arriba

  // Procesar elementos en orden (saltando la fuente)
  for (const elemento of escena.elementos) {
    if (elemento.tipo === 'fuente') continue;

    if (elemento.tipo === 'interfaz') {
      const interfaz = elemento;
      // Solo procesamos si el rayo se dirige hacia la interfaz
      if ((angulo >= 0 && interfaz.x > x) || (angulo < 0 && interfaz.x < x) ||
          (x < interfaz.x)) {
        // Calcular y en la interfaz
        const dx = interfaz.x - x;
        const dy = dx * Math.tan(angulo);
        const yInterfaz = y + dy;

        puntos.push({ x: interfaz.x, y: yInterfaz });

        // Aplicar Snell exacto
        const resultado = refract(interfaz.n1, interfaz.n2, angulo);
        if (resultado.tir) {
          // Reflexión total interna: rebotar
          puntos[puntos.length - 1]!.tir = true;
          angulo = reflect(angulo);
        } else {
          angulo = resultado.theta;
        }
        x = interfaz.x;
        y = yInterfaz;
      }
    } else if (elemento.tipo === 'espejo-plano') {
      const espejo = elemento;
      const dx = espejo.x - x;
      const dy = dx * Math.tan(angulo);
      const yEspejo = y + dy;

      puntos.push({ x: espejo.x, y: yEspejo });

      // Reflexión especular: el espejo tiene ángulo `espejo.angulo` respecto a la vertical
      // La normal del espejo apunta en sentido horizontal si espejo.angulo = 0
      // Para espejo vertical (angulo=0): invertir componente x del rayo
      const normalAngulo = espejo.angulo; // ángulo de la normal respecto al eje x
      // Reflexión: θ_reflejado = 2*normalAngulo - θ_incidente (geometría)
      angulo = 2 * normalAngulo - angulo;
      x = espejo.x;
      y = yEspejo;
    }
  }

  // Extender hasta xFin
  const dxFin = xFin - x;
  const dyFin = dxFin * Math.tan(angulo);
  puntos.push({ x: xFin, y: y + dyFin });

  return puntos;
}
```

- [ ] **Step 2: Escribir los tests del trazador**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/core/content/__tests__/optics.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { trazarRayos } from '../optics';
import type { EscenaOptica } from '../optics';

describe('trazarRayos — escena vacía o sin fuente', () => {
  it('devuelve array vacío si no hay fuente', () => {
    const escena: EscenaOptica = { elementos: [] };
    expect(trazarRayos(escena, 1)).toEqual([]);
  });

  it('con solo fuente, traza hasta xFin en línea recta', () => {
    const escena: EscenaOptica = {
      elementos: [{ tipo: 'fuente', x: -0.5, y: 0, angulo: 0 }],
    };
    const puntos = trazarRayos(escena, 0.5);
    expect(puntos).toHaveLength(2);
    expect(puntos[0]).toMatchObject({ x: -0.5, y: 0 });
    expect(puntos[1]!.x).toBeCloseTo(0.5, 5);
    expect(puntos[1]!.y).toBeCloseTo(0, 5); // ángulo 0 = rayo horizontal
  });
});

describe('trazarRayos — interfaz (Snell exacto)', () => {
  it('rayo horizontal no se refracta (θ=0)', () => {
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: 0 },
        { tipo: 'interfaz', x: 0, n1: 1.0, n2: 1.33 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    // Tres puntos: fuente, cruce interfaz, fin
    expect(puntos).toHaveLength(3);
    // El cruce está en x=0, y=0 (rayo horizontal)
    expect(puntos[1]!.x).toBeCloseTo(0, 5);
    expect(puntos[1]!.y).toBeCloseTo(0, 5);
    // Ángulo refractado ≈ 0 (sin 0 = 0)
    expect(puntos[2]!.y).toBeCloseTo(0, 5);
  });

  it('rayo a 30° se refracta correctamente en agua (Snell verifica)', () => {
    const theta1 = Math.PI / 6; // 30°
    const n1 = 1.0;
    const n2 = 1.33;
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: theta1 },
        { tipo: 'interfaz', x: 0, n1, n2 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    expect(puntos).toHaveLength(3);
    // Verificar Snell en el destino: ángulo θ2 = asin(n1*sin(θ1)/n2)
    const theta2Esperado = Math.asin((n1 * Math.sin(theta1)) / n2);
    // Calcular ángulo real del último segmento
    const dx = puntos[2]!.x - puntos[1]!.x;
    const dy = puntos[2]!.y - puntos[1]!.y;
    const anguloReal = Math.atan2(dy, dx);
    expect(anguloReal).toBeCloseTo(theta2Esperado, 4);
  });

  it('TIR: el rayo supercrítico no cruza la interfaz', () => {
    const n1 = 1.33;
    const n2 = 1.0;
    const anguloCritico = Math.asin(n2 / n1);
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: anguloCritico + 0.05 },
        { tipo: 'interfaz', x: 0, n1, n2 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    // El punto de cruce debe marcarse como TIR
    const cruceTIR = puntos.find(p => p.tir === true);
    expect(cruceTIR).toBeDefined();
  });
});

describe('trazarRayos — espejo plano', () => {
  it('espejo vertical (angulo=0) refleja horizontalmente hacia la izquierda', () => {
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: 0 },
        { tipo: 'espejo-plano', x: 0, angulo: 0 },
      ],
    };
    const puntos = trazarRayos(escena, -0.5); // xFin a la izquierda tras reflexión
    expect(puntos).toHaveLength(3);
    // El tercer punto debe estar a la izquierda del espejo
    expect(puntos[2]!.x).toBeLessThan(0);
  });
});
```

- [ ] **Step 3: Ejecutar los tests**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npm test -- --reporter=verbose 2>&1 | grep -E "(PASS|FAIL|✓|✗|optics|graph)"
```

Esperado: tests de `optics.test.ts` y `graph.test.ts` en verde.

---

### Task 3: Tipos de capítulo y registro — `src/content/chapters/`

**Files:**
- Create: `src/content/chapters/types.ts`
- Create: `src/content/chapters/refraccion.ts`
- Create: `src/content/chapters/index.ts`

**Interfaces:**
- Consumes: `EscenaOptica` de `../../core/content/optics`
- Produces:
  - `Capitulo { conceptoId, escena, deduccion, escenaBanco, objetivo }`
  - `Objetivo { tipo: 'fermat'; config: ObjetivoFermat }` (extensible)
  - `getCapitulo(id: string): Capitulo | undefined`
  - `capituloDisponible(id: string): boolean`

- [ ] **Step 1: Crear `types.ts`**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/content/chapters/types.ts`:

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
  /** Clave i18n del botón de inicio */
  comenzarKey: string;
}

/** Objetivo tipo Fermat: minimizar el camino óptico */
export interface ObjetivoFermat {
  tipo: 'fermat';
  n1: number;
  n2: number;
  A: { x: number; y: number };
  B: { x: number; y: number };
}

/** Unión de objetivos posibles (extensible con nuevos tipos) */
export type Objetivo = ObjetivoFermat;

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

- [ ] **Step 2: Crear `refraccion.ts` (capítulo migrado)**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/content/chapters/refraccion.ts`:

```typescript
// Capítulo Refracción — definición declarativa.
// Los parámetros físicos coinciden exactamente con los de Fase 0.

import type { Capitulo } from './types';

export const capituloRefraccion: Capitulo = {
  conceptoId: 'refraccion',

  escena: {
    fraseKey: 'refraccion.frase',
    tituloKey: 'refraccion.titulo',
    intuicionKey: 'refraccion.intuicion',
    deduccionTituloKey: 'refraccion.deduccion.titulo',
    deduccionTextoKey: 'refraccion.deduccion.texto',
    deduccionDerivacionKey: 'refraccion.deduccion.derivacion',
    comenzarKey: 'refraccion.comenzar',
  },

  escenaBanco: {
    elementos: [
      // Fuente de rayo (posición idéntica a Fase 0: SOURCE_X_NORM=-0.6, SOURCE_Y_NORM=-0.25)
      { tipo: 'fuente', x: -0.6, y: -0.25, angulo: Math.PI / 6 },
      // Interfaz agua (n2=1.33), posición x=0 = centro del canvas
      { tipo: 'interfaz', x: 0, n1: 1.0, n2: 1.33 },
    ],
  },

  objetivo: {
    tipo: 'fermat',
    n1: 1.0,
    n2: 1.33,
    A: { x: -0.55, y: -0.3 },
    B: { x: 0.55, y: 0.22 },
  },
};
```

- [ ] **Step 3: Crear `index.ts` del registro**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/content/chapters/index.ts`:

```typescript
// Registro de capítulos disponibles.
// getCapitulo(id) devuelve el capítulo si está implementado.
// capituloDisponible(id) indica si tiene implementación (no solo si está desbloqueado).

import type { Capitulo } from './types';
import { capituloRefraccion } from './refraccion';

/** Mapa de capítulos implementados (conceptoId → Capitulo) */
const CAPITULOS: Map<string, Capitulo> = new Map([
  ['refraccion', capituloRefraccion],
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

- [ ] **Step 4: Verificar que TypeScript compile**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1
```

Esperado: sin errores.

---

### Task 4: Refactorizar `bench.ts` para aceptar `EscenaOptica`

**Files:**
- Modify: `src/render/render2d/bench.ts`

**Interfaces:**
- Consumes: `EscenaOptica`, `trazarRayos`, `PuntoRayo` de `../../core/content/optics`
- Produces: `BenchConfig` actualizado con `escena: EscenaOptica`, `n1/n2/thetaInc` se derivan de la escena o se mantienen como overrides interactivos

**Decisión de diseño:** `BenchConfig` mantiene `n1`, `n2`, `thetaInc` como estado mutable (necesarios para la interacción del usuario). La `EscenaOptica` es la config inicial; los valores interactivos sobreescriben los de la fuente/interfaz en el dibujo. La función `trazarRayos` se usa para calcular la polilínea; el dibujo Canvas2D existente se adapta para consumirla.

- [ ] **Step 1: Actualizar `BenchConfig` y el constructor**

Modificar `/Users/kegouro/HIBRIS/Proyectos/lumina/src/render/render2d/bench.ts`.

Añadir el import al principio (después de las importaciones existentes):

```typescript
import type { EscenaOptica } from '../../core/content/optics';
import { trazarRayos } from '../../core/content/optics';
```

Cambiar la interfaz `BenchConfig` — añadir el campo `escena` y hacerlo opcional para compatibilidad:

```typescript
export interface BenchConfig {
  canvas: HTMLCanvasElement;
  n1: number;
  n2: number;
  thetaInc: number;
  fermatMode: boolean;
  /** Escena óptica declarativa (si se provee, el banco usa trazarRayos interno) */
  escena?: EscenaOptica;
  onAngleChange: (theta: number) => void;
  onFermatPChange: (py: number) => void;
}
```

En la clase `Bench`, añadir campo privado:

```typescript
private escena: EscenaOptica | undefined;
```

En el constructor, inicializarlo:

```typescript
this.escena = config.escena;
```

En `updateState`, añadir soporte para `escena`:

```typescript
if (s.escena !== undefined) this.escena = s.escena;
```

- [ ] **Step 2: Adaptar `drawRay` para usar `trazarRayos` si hay escena**

Dentro de la clase `Bench`, al inicio de `drawRay()`, añadir una rama que usa `trazarRayos` si `this.escena` está definida. Si no hay escena, el comportamiento original se conserva exactamente:

Reemplazar el método `drawRay()` completo con:

```typescript
private drawRay(): void {
  if (this.escena) {
    this.drawRayDesdeEscena();
  } else {
    this.drawRayLegacy();
  }
}
```

Renombrar el método `drawRay()` original a `drawRayLegacy()` (sin cambios en su cuerpo).

Añadir el nuevo método `drawRayDesdeEscena()`:

```typescript
/** Dibuja el rayo usando trazarRayos() sobre la EscenaOptica */
private drawRayDesdeEscena(): void {
  if (!this.escena) return;
  const ctx = this.ctx;

  // Construir escena con el ángulo interactivo actual
  const escenaActual: EscenaOptica = {
    elementos: this.escena.elementos.map(el => {
      if (el.tipo === 'fuente') {
        return { ...el, angulo: this.thetaInc };
      }
      if (el.tipo === 'interfaz') {
        return { ...el, n1: this.n1, n2: this.n2 };
      }
      return el;
    }),
  };

  const puntos = trazarRayos(escenaActual, 0.95); // xFin en coordenadas norm
  if (puntos.length < 2) return;

  const rayColor = DOMAIN_COLORS.ray;
  const segCount = puntos.length - 1;
  const segSize = 1 / segCount;

  for (let i = 0; i < segCount; i++) {
    const from = this.normToPx(puntos[i]!.x, puntos[i]!.y);
    const to = this.normToPx(puntos[i + 1]!.x, puntos[i + 1]!.y);
    const esTIR = puntos[i + 1]!.tir === true;
    const color = esTIR ? '#ff7a3c' : rayColor;
    this.drawSegmentAA(ctx, from, to, color, 2.0, this.pulseProgress, i * segSize, (i + 1) * segSize);
  }

  // Marcador de la fuente
  const fuente = escenaActual.elementos.find(e => e.tipo === 'fuente');
  if (fuente && fuente.tipo === 'fuente') {
    const src = this.normToPx(fuente.x, fuente.y);
    ctx.save();
    ctx.fillStyle = rayColor;
    ctx.shadowColor = rayColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(src.x, src.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Ángulo crítico indicator (igual que en legacy)
  const { criticalAngle } = await import('../../core/snell').catch(() => ({ criticalAngle: () => null }));
  // Nota: usar import estático para evitar async en draw
}
```

**Nota:** La línea de `criticalAngle` con `await import` es incorrecta en un contexto síncrono. Usar el import estático que ya existe en el archivo. Corrección — reemplazar el bloque del ángulo crítico en `drawRayDesdeEscena()` con la llamada directa (ya importada al inicio del archivo):

```typescript
// Ángulo crítico indicator
const interfazEl = escenaActual.elementos.find(e => e.tipo === 'interfaz');
if (interfazEl && interfazEl.tipo === 'interfaz') {
  const cruce = puntos[1]; // primer punto de cruce
  if (cruce) {
    const crucePx = this.normToPx(cruce.x, cruce.y);
    const ca = criticalAngle(interfazEl.n1, interfazEl.n2);
    if (ca !== null) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 122, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      const r = 40;
      ctx.beginPath();
      ctx.arc(crucePx.x, crucePx.y, r, -Math.PI / 2, -Math.PI / 2 + ca);
      ctx.stroke();
      ctx.restore();
    }
  }
}
```

- [ ] **Step 3: Ejecutar todos los tests**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npm test 2>&1 | tail -10
```

Esperado: `Tests  X passed (X)` donde X ≥ 43. Sin failures.

- [ ] **Step 4: Verificar que TypeScript compile**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1
```

---

### Task 5: Claves i18n para el mapa y estados de nodos

**Files:**
- Modify: `src/ui/i18n/es.ts`
- Modify: `src/ui/i18n/en.ts`

**Interfaces:**
- Produces: claves nuevas para el mapa de progresión

- [ ] **Step 1: Añadir claves en `es.ts`**

En `/Users/kegouro/HIBRIS/Proyectos/lumina/src/ui/i18n/es.ts`, antes del cierre `} as const;`, añadir:

```typescript
  // Mapa de progresión
  'mapa.titulo': 'Acto I — La luz como rayo',
  'mapa.nodo.bloqueado': 'Bloqueado',
  'mapa.nodo.disponible': 'Disponible',
  'mapa.nodo.completado': 'Completado',
  'mapa.nodo.proximamente': 'Próximamente',
  'mapa.nodo.prereqs': 'Requiere completar antes:',
  'mapa.volver': 'Volver al menú',
  'mapa.ruta.pedagogica': 'Ruta pedagógica',
  'mapa.ruta.historica': 'Ruta histórica',
```

- [ ] **Step 2: Añadir las mismas claves en `en.ts`**

En `/Users/kegouro/HIBRIS/Proyectos/lumina/src/ui/i18n/en.ts`, antes del cierre `};`, añadir:

```typescript
  // Progress map
  'mapa.titulo': 'Act I — Light as a Ray',
  'mapa.nodo.bloqueado': 'Locked',
  'mapa.nodo.disponible': 'Available',
  'mapa.nodo.completado': 'Completed',
  'mapa.nodo.proximamente': 'Coming soon',
  'mapa.nodo.prereqs': 'Requires completing first:',
  'mapa.volver': 'Back to menu',
  'mapa.ruta.pedagogica': 'Pedagogical route',
  'mapa.ruta.historica': 'Historical route',
```

- [ ] **Step 3: Verificar que TypeScript compile (i18n es estricto en claves)**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1
```

Esperado: sin errores. El tipo `en` es `Record<keyof typeof es, string>` — si falta alguna clave en `en.ts`, TS lo detectará aquí.

---

### Task 6: Mapa de progresión — `src/ui/map/`

**Files:**
- Create: `src/ui/map/index.ts`
- Create: `src/ui/map/map.css`

**Interfaces:**
- Consumes:
  - `conceptosEnRuta(ruta)` de `../../core/content/graph`
  - `estaDesbloqueado(id, completados)` de `../../core/content/graph`
  - `capituloDisponible(id)` de `../../content/chapters`
  - `isCompletado(id)` de `../../services/persistence`
  - `t(key)` de `../i18n`
  - `fade` de `../../cinematics`
- Produces:
  - `MapOptions { onCapitulo: (id: string) => void; onVolver: () => void }`
  - `mountMap(container: HTMLElement, opts: MapOptions): void`

- [ ] **Step 1: Crear los estilos del mapa**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/ui/map/map.css`:

```css
/* Mapa de progresión — sendero vertical de nodos */
.mapa {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 0;
  min-height: 100%;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

.mapa__titulo {
  font-family: var(--font-display, serif);
  font-size: 1.4rem;
  color: var(--color-ink, #efe7d8);
  margin-bottom: 2rem;
  text-align: center;
  opacity: 0.9;
}

.mapa__nodos {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
}

/* Conector vertical entre nodos */
.mapa__conector {
  width: 2px;
  height: 32px;
  background: linear-gradient(to bottom, var(--color-linea, #2a2118), var(--color-linea, #2a2118));
  flex-shrink: 0;
}

.mapa__conector--activo {
  background: linear-gradient(to bottom, var(--color-beam, #f5a72c), var(--color-linea, #2a2118));
}

/* Nodo del mapa */
.mapa-nodo {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
  padding: 0.875rem 1.25rem;
  border-radius: 10px;
  border: 1.5px solid var(--color-linea, #2a2118);
  background: var(--color-panel, #15110d);
  cursor: default;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
}

.mapa-nodo:focus-visible {
  outline: 2px solid var(--color-beam, #f5a72c);
  outline-offset: 2px;
}

.mapa-nodo--disponible {
  border-color: var(--color-beam, #f5a72c);
  cursor: pointer;
}

.mapa-nodo--disponible:hover {
  background: rgba(245, 167, 44, 0.07);
}

.mapa-nodo--completado {
  border-color: var(--color-wave, #38bdf8);
  cursor: pointer;
}

.mapa-nodo--completado:hover {
  background: rgba(56, 189, 248, 0.05);
}

.mapa-nodo--bloqueado {
  opacity: 0.45;
}

.mapa-nodo--proximamente {
  opacity: 0.35;
}

/* Icono del estado */
.mapa-nodo__icono {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.mapa-nodo__icono--completado {
  background: rgba(56, 189, 248, 0.15);
  color: var(--color-wave, #38bdf8);
  border: 1.5px solid var(--color-wave, #38bdf8);
}

.mapa-nodo__icono--disponible {
  background: rgba(245, 167, 44, 0.15);
  color: var(--color-beam, #f5a72c);
  border: 1.5px solid var(--color-beam, #f5a72c);
}

.mapa-nodo__icono--bloqueado {
  background: rgba(154, 138, 118, 0.08);
  color: var(--color-muted, #9a8a76);
  border: 1.5px solid var(--color-linea, #2a2118);
}

.mapa-nodo__cuerpo {
  flex: 1;
  min-width: 0;
}

.mapa-nodo__titulo {
  font-size: 0.95rem;
  color: var(--color-ink, #efe7d8);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mapa-nodo__estado {
  font-size: 0.72rem;
  color: var(--color-muted, #9a8a76);
  margin-top: 0.15rem;
}

.mapa-nodo--completado .mapa-nodo__estado {
  color: var(--color-wave, #38bdf8);
}

.mapa-nodo--disponible .mapa-nodo__estado {
  color: var(--color-beam, #f5a72c);
}

.mapa__volver {
  margin-top: 2.5rem;
  font-size: 0.8rem;
  color: var(--color-muted, #9a8a76);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: color 0.2s;
}

.mapa__volver:hover {
  color: var(--color-ink, #efe7d8);
}

.mapa__volver:focus-visible {
  outline: 2px solid var(--color-beam, #f5a72c);
  outline-offset: 2px;
}
```

- [ ] **Step 2: Crear `index.ts` del mapa**

Crear `/Users/kegouro/HIBRIS/Proyectos/lumina/src/ui/map/index.ts`:

```typescript
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
  /** Callback cuando el usuario elige un capítulo */
  onCapitulo: (id: string) => void;
  /** Callback para volver al menú principal */
  onVolver: () => void;
}

type EstadoNodo = 'completado' | 'disponible' | 'bloqueado' | 'proximamente';

/**
 * Monta el mapa de progresión en el contenedor dado.
 * Lee el progreso desde localStorage.
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

  // ── Construir HTML ──────────────────────────────────────────────────────────
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
    let estado: EstadoNodo;
    const tieneCapitulo = capituloDisponible(concepto.id);
    const completado = completados.includes(concepto.id);
    const desbloqueado = estaDesbloqueado(concepto.id, completados);

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

    // Hacer interactivo si disponible o completado
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

  // Foco inicial al primer nodo disponible
  const primerDisponible = nodosDiv.querySelector<HTMLElement>('.mapa-nodo--disponible');
  if (primerDisponible) {
    setTimeout(() => primerDisponible.focus(), 450);
  }
}

/** Crea el elemento DOM de un nodo del mapa */
function crearNodo(id: string, titulo: string, estado: EstadoNodo): HTMLElement {
  const nodo = document.createElement('div');
  nodo.className = `mapa-nodo mapa-nodo--${estado}`;
  nodo.dataset['conceptoId'] = id;

  // Icono según estado
  const iconoMap: Record<EstadoNodo, { clase: string; texto: string }> = {
    completado:   { clase: 'completado', texto: '✓' },
    disponible:   { clase: 'disponible', texto: '→' },
    bloqueado:    { clase: 'bloqueado', texto: '🔒' },
    proximamente: { clase: 'bloqueado', texto: '·' },
  };
  const icono = iconoMap[estado];

  const etiquetaEstadoKey: Record<EstadoNodo, TranslationKey> = {
    completado:   'mapa.nodo.completado',
    disponible:   'mapa.nodo.disponible',
    bloqueado:    'mapa.nodo.bloqueado',
    proximamente: 'mapa.nodo.proximamente',
  };

  nodo.innerHTML = `
    <div class="mapa-nodo__icono mapa-nodo__icono--${icono.clase}"
         aria-hidden="true">${icono.texto}</div>
    <div class="mapa-nodo__cuerpo">
      <div class="mapa-nodo__titulo">${titulo}</div>
      <div class="mapa-nodo__estado">${t(etiquetaEstadoKey[estado])}</div>
    </div>
  `;

  if (estado === 'disponible' || estado === 'completado') {
    nodo.setAttribute('aria-label', `${titulo} — ${t(etiquetaEstadoKey[estado])}`);
  } else {
    nodo.setAttribute('aria-label', `${titulo} — ${t(etiquetaEstadoKey[estado])}`);
    nodo.setAttribute('aria-disabled', 'true');
  }

  return nodo;
}
```

- [ ] **Step 3: Verificar que TypeScript compile**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1
```

---

### Task 7: Actualizar `story/index.ts` para capítulo genérico

**Files:**
- Modify: `src/ui/story/index.ts`

**Interfaces:**
- Consumes: `Capitulo` de `../../content/chapters`, `getCapitulo` de `../../content/chapters`
- Change: `StoryOptions.capituloId` pasa de `'refraccion'` (literal) a `string`

- [ ] **Step 1: Actualizar `StoryOptions`**

En `/Users/kegouro/HIBRIS/Proyectos/lumina/src/ui/story/index.ts`, cambiar:

```typescript
export interface StoryOptions {
  capituloId: 'refraccion';
  onComenzar: () => void;
}
```

a:

```typescript
import { getCapitulo } from '../../content/chapters';
import type { EscenaCinematica } from '../../content/chapters/types';

export interface StoryOptions {
  capituloId: string;
  onComenzar: () => void;
}
```

- [ ] **Step 2: Usar la escena del capítulo en vez de claves hardcodeadas**

Reemplazar el cuerpo de `mountStory()` para leer la `EscenaCinematica` del capítulo. Si el capítulo no existe, mostrar un mensaje de error:

```typescript
export function mountStory(container: HTMLElement, opts: StoryOptions): void {
  const capitulo = getCapitulo(opts.capituloId);

  if (!capitulo) {
    // Capítulo no implementado — mostrar pantalla de error mínima
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
        ${t('refraccion.deduccion.ver')}
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

  // Toggle deducción
  const toggleBtn = screen.querySelector('#story-toggle') as HTMLButtonElement;
  const deduccion = screen.querySelector('#story-deduccion') as HTMLElement;
  let abierto = false;
  toggleBtn.addEventListener('click', () => {
    abierto = !abierto;
    deduccion.classList.toggle('visible', abierto);
    deduccion.setAttribute('aria-hidden', String(!abierto));
    toggleBtn.setAttribute('aria-expanded', String(abierto));
    toggleBtn.textContent = abierto
      ? t('refraccion.deduccion.ocultar')
      : t('refraccion.deduccion.ver');
  });

  screen.querySelector('#story-comenzar')?.addEventListener('click', opts.onComenzar);

  // Animación de entrada
  const frase = screen.querySelector('#story-frase') as HTMLElement;
  const intuicion = screen.querySelector('#story-intuicion') as HTMLElement;
  const comenzarBtn = screen.querySelector('#story-comenzar') as HTMLElement;
  frase.style.opacity = '0';
  intuicion.style.opacity = '0';
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
```

Añadir `import type { TranslationKey } from '../i18n';` en el archivo.

- [ ] **Step 3: Verificar compilación y tests**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1 && npm test 2>&1 | tail -8
```

---

### Task 8: Cablear `app.ts` — flujo con mapa

**Files:**
- Modify: `src/app.ts`

**Interfaces:**
- Consumes: `mountMap` de `./ui/map`, `getCapitulo` de `./content/chapters`
- Change: `irAStory()` ahora es `irAlMapa()` → mapa → `irAStory(capituloId)` → escena → `irAlBanco(capituloId)`

- [ ] **Step 1: Añadir import de `mountMap` y `getCapitulo`**

En `/Users/kegouro/HIBRIS/Proyectos/lumina/src/app.ts`, añadir después de los imports existentes:

```typescript
import { mountMap } from './ui/map';
import { getCapitulo } from './content/chapters';
```

- [ ] **Step 2: Añadir `capituloActualId` al estado de la app y actualizar las funciones**

Añadir al estado y a las funciones de navegación:

```typescript
// En AppState, añadir:
capituloActualId: string;

// En STATE, inicializar:
capituloActualId: 'refraccion',
```

Reemplazar la función `irAStory()` (que antes saltaba directo a refracción) por `irAlMapa()`:

```typescript
function irAlMapa(): void {
  limpiarPantalla();
  STATE.screen = 'story'; // reutilizar estado 'story' para el mapa

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
```

En el `onHistoria` del menú, llamar `irAlMapa()` en lugar de `irAStory()`:

```typescript
onHistoria: irAlMapa,
```

- [ ] **Step 3: Actualizar `irAlBanco` para usar la `EscenaOptica` del capítulo**

Modificar `irAlBanco` para que reciba `capituloId` y lo use al crear el banco:

```typescript
function irAlBanco(capituloId: string): void {
  limpiarPantalla();
  STATE.screen = 'bench';

  const capitulo = getCapitulo(capituloId);

  const wrapper = document.createElement('div');
  wrapper.className = 'bench-wrapper';

  const canvas = document.createElement('canvas');
  canvas.className = 'bench-canvas';
  canvas.setAttribute('aria-label', t('bench.arrastrar'));
  canvas.setAttribute('role', 'img');

  wrapper.appendChild(canvas);
  appContainer.appendChild(wrapper);

  wrapper.style.opacity = '0';
  requestAnimationFrame(() => {
    fade(wrapper, { from: 0, to: 1, duration: 500 });
  });

  bench = new Bench({
    canvas,
    n1: STATE.n1,
    n2: STATE.n2,
    thetaInc: STATE.thetaInc,
    fermatMode: STATE.fermatMode,
    // Pasar la EscenaOptica del capítulo si existe
    escena: capitulo?.escenaBanco,
    onAngleChange(theta) {
      STATE.thetaInc = theta;
      actualizarHUD();
    },
    onFermatPChange(py) {
      if (fermatHandle) fermatHandle.updateP(py);
    },
  });

  hudHandle = mountHUD(appContainer, calcularHUDState());

  // Panel de Fermat solo si el objetivo del capítulo es de tipo 'fermat'
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
```

- [ ] **Step 4: Actualizar `manejarDesbloqueo` para recibir el id del capítulo**

```typescript
function manejarDesbloqueo(capituloId: string): void {
  if (desbloqueadoYa) return;
  desbloqueadoYa = true;

  const capitulo = getCapitulo(capituloId);
  marcarCompletado(capituloId);
  if (capitulo?.objetivo.tipo === 'fermat') {
    desbloquearHerramienta('interfaz');
  }

  mostrarBannerDesbloqueo();
}
```

Actualizar la llamada original a `manejarDesbloqueo()` en el Bench (ya se pasa en el closure `() => manejarDesbloqueo(capituloId)`).

También eliminar la variable `capituloId` hardcodeada que ya no se usa.

- [ ] **Step 5: Ejecutar todos los tests y compilar**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npx tsc --noEmit 2>&1 && npm test 2>&1 | tail -10
```

Esperado: sin errores TS, todos los tests en verde.

---

### Task 9: Importar el CSS del mapa en `vite` y ajustes finales

**Files:**
- Modify: `src/app.ts` o `src/main.ts` — verificar que los CSS nuevos se cargan

**Nota:** En Vite con TypeScript, los imports de CSS dentro de módulos `.ts` se resuelven automáticamente. Como `src/ui/map/index.ts` hace `import './map.css'`, Vite lo recogerá. Verificar que `src/main.ts` importa `app.ts` y que el CSS de tokens ya está en el HTML.

- [ ] **Step 1: Leer `src/main.ts` y verificar el punto de entrada**

```bash
cat "/Users/kegouro/HIBRIS/Proyectos/lumina/src/main.ts"
```

Si `main.ts` importa `app.ts`, el CSS se cargará automáticamente al importar `src/ui/map/index.ts`.

- [ ] **Step 2: Verificar que los tokens CSS incluyen las variables del mapa**

Revisar `/Users/kegouro/HIBRIS/Proyectos/lumina/src/styles/tokens.css` para confirmar que `--color-panel`, `--color-linea`, `--color-ink`, `--color-muted`, `--color-beam`, `--color-wave` están definidos. Si alguno falta, añadirlo.

- [ ] **Step 3: Build completo**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npm run build 2>&1 | tail -20
```

Esperado: build exitoso sin errores ni warnings críticos.

- [ ] **Step 4: Tests completos — confirmación final**

```bash
cd "/Users/kegouro/HIBRIS/Proyectos/lumina" && npm test -- --reporter=verbose 2>&1 | tail -20
```

Esperado: todos los tests en verde (43 anteriores + nuevos de graph + optics).

---

## Resumen de módulos y tipos clave producidos

| Módulo | Tipo/función principal |
|--------|----------------------|
| `src/core/content/graph.ts` | `Concepto`, `CONCEPTOS[]`, `conceptosEnRuta()`, `estaDesbloqueado()` |
| `src/core/content/optics.ts` | `ElementoOptico` (unión), `EscenaOptica`, `PuntoRayo`, `trazarRayos()` |
| `src/content/chapters/types.ts` | `Capitulo`, `EscenaCinematica`, `Objetivo`, `ObjetivoFermat` |
| `src/content/chapters/refraccion.ts` | `capituloRefraccion: Capitulo` |
| `src/content/chapters/index.ts` | `getCapitulo()`, `capituloDisponible()` |
| `src/ui/map/index.ts` | `mountMap(container, opts)` |
| `src/render/render2d/bench.ts` | `BenchConfig.escena?: EscenaOptica`, `drawRayDesdeEscena()` |
| `src/app.ts` | flujo: menú → `irAlMapa()` → mapa → `irAStory(id)` → banco con `EscenaOptica` |
