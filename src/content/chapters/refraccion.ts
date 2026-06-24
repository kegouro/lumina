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
    deduccionVerKey: 'refraccion.deduccion.ver',
    deduccionOcultarKey: 'refraccion.deduccion.ocultar',
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
