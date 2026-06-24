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
