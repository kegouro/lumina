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

/** Objetivo tipo dispersion: separar el espectro / alcanzar desviación mínima */
export interface ObjetivoDispersion {
  tipo: 'dispersion';
  /** Tolerancia en grados respecto a la desviación mínima para considerar objetivo cumplido */
  toleranciaGrados: number;
}

/** Objetivo tipo lentes: formar imagen nítida (objeto en 2f, m ≈ −1) */
export interface ObjetivoLentes {
  tipo: 'lentes';
  /** Distancia focal de la lente (en unidades normalizadas bench) */
  f: number;
  /** Tolerancia relativa en la posición del objeto respecto a 2f */
  tolerancia: number;
}

/** Objetivo tipo aberraciones: minimizar aberración cerrando el diafragma */
export interface ObjetivoAberraciones {
  tipo: 'aberraciones';
  /** Apertura máxima normalizada (yMax) */
  aperturaMax: number;
  /** Umbral de aberración longitudinal (en unidades norm) por debajo del cual se cumple */
  umbralAberracion: number;
}

/** Objetivo tipo instrumentos: lograr configuración afocal (separación ≈ f₁+f₂) */
export interface ObjetivoInstrumentos {
  tipo: 'instrumentos';
  /** Focal de la lente objetivo (unidades norm) */
  f1: number;
  /** Focal del ocular (unidades norm) */
  f2: number;
  /** Tolerancia relativa para considerar configuración afocal */
  tolerancia: number;
}

/** Unión de objetivos posibles (extensible con nuevos tipos) */
export type Objetivo =
  | ObjetivoFermat
  | ObjetivoRayo
  | ObjetivoReflexionBlanco
  | ObjetivoFermatReflexion
  | ObjetivoDispersion
  | ObjetivoLentes
  | ObjetivoAberraciones
  | ObjetivoInstrumentos;

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
