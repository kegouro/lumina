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

  // Fuente a la izquierda apuntando al espejo en x=0.4.
  // El espejo es vertical (angulo=0): la reflexión devuelve el rayo hacia la izquierda.
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.6, y: -0.25, angulo: Math.PI / 6 },
      { tipo: 'espejo-plano', x: 0.4, angulo: 0 },
    ],
  },

  // El blanco está en y=0 (eje óptico); el rayo reflejado debe pasar por él.
  objetivo: {
    tipo: 'reflexion-blanco',
    blancoY: 0,
    tolerancia: 0.08,
  },
};
