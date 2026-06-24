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
  /**
   * Ángulo de la normal del espejo respecto al eje x (radianes).
   * 0 = espejo vertical (normal horizontal); el rayo incidente horizontal rebota.
   */
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
  /** true si en este punto hay TIR (para colorear distinto el segmento saliente) */
  tir?: boolean;
}

// ── Trazador puro ────────────────────────────────────────────────────────────

/**
 * Traza un rayo a través de la escena y produce la polilínea de puntos.
 * Los elementos se procesan en orden de aparición en `escena.elementos`.
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
      // Solo procesar si el rayo puede alcanzar la interfaz (interfaz está adelante del rayo)
      if (x < elemento.x) {
        const dx = elemento.x - x;
        const dy = dx * Math.tan(angulo);
        const yInterfaz = y + dy;

        puntos.push({ x: elemento.x, y: yInterfaz });

        // Aplicar Snell exacto
        const resultado = refract(elemento.n1, elemento.n2, angulo);
        if (resultado.tir) {
          // Reflexión total interna: marcar y rebotar
          puntos[puntos.length - 1]!.tir = true;
          angulo = reflect(angulo);
        } else {
          angulo = resultado.theta;
        }
        x = elemento.x;
        y = yInterfaz;
      }
    } else if (elemento.tipo === 'espejo-plano') {
      // Calcular intersección con el espejo (asumiendo espejo alcanzable)
      const dx = elemento.x - x;
      const dy = dx * Math.tan(angulo);
      const yEspejo = y + dy;

      puntos.push({ x: elemento.x, y: yEspejo });

      // Reflexión especular respecto a la normal del espejo
      // angulo_reflejado = 2 * angulo_normal - angulo_incidente
      angulo = 2 * elemento.angulo - angulo;
      x = elemento.x;
      y = yEspejo;
    }
  }

  // Extender hasta xFin
  const dxFin = xFin - x;
  const dyFin = dxFin * Math.tan(angulo);
  puntos.push({ x: xFin, y: y + dyFin });

  return puntos;
}
