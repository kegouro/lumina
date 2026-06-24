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
