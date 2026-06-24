// Capítulo Aberraciones — donde la física "sangra".
// Banco: una lente convergente y un abanico de rayos a distintas alturas que
// NO convergen a un punto. Los rayos marginales enfocan más cerca que los
// paraxiales (aberración esférica). Además, rayos de distinta λ enfocan en
// puntos distintos (aberración cromática).
// Interacción: variar la apertura (diafragma). Al cerrarla, los rayos
// marginales desaparecen y la mancha se reduce.
// Objetivo: minimizar la aberración cerrando la apertura.

import type { Capitulo } from './types';

const F_NORM = 0.30;      // focal de la lente (igual que lentes)
const APERTURA_MAX = 0.45; // apertura máxima del abanico

export const capituloAberraciones: Capitulo = {
  conceptoId: 'aberraciones',

  escena: {
    fraseKey: 'aberraciones.frase',
    tituloKey: 'aberraciones.titulo',
    intuicionKey: 'aberraciones.intuicion',
    deduccionTituloKey: 'aberraciones.deduccion.titulo',
    deduccionTextoKey: 'aberraciones.deduccion.texto',
    deduccionDerivacionKey: 'aberraciones.deduccion.derivacion',
    deduccionVerKey: 'aberraciones.deduccion.ver',
    deduccionOcultarKey: 'aberraciones.deduccion.ocultar',
    comenzarKey: 'aberraciones.comenzar',
  },

  // Banco: lente convergente en x=0, objeto en el infinito (rayos paralelos)
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.85, y: 0, angulo: 0 },
      { tipo: 'lente', x: 0, f: F_NORM },
    ],
  },

  objetivo: {
    tipo: 'aberraciones',
    aperturaMax: APERTURA_MAX,
    umbralAberracion: 0.015, // |longitudinal| < 1.5 % del canvas → objetivo cumplido
  },
};
