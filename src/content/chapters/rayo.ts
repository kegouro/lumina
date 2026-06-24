// Capítulo "El rayo de luz" — cámara oscura (pinhole).
// Objetivo observacional: el banco muestra la imagen invertida y el alumno
// confirma haberla observado. La visualización es un render dedicado (no
// usa trazarRayos, que solo maneja un rayo único).

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

  // Escena mínima: una fuente que sirve como marcador de posición.
  // El banco detecta objetivo 'pinhole' y usa drawPinhole() en su lugar.
  escenaBanco: {
    elementos: [
      // Punta de la flecha (arriba): rayo converge hacia abajo-derecha al cruzar el agujero
      { tipo: 'fuente', x: -0.6, y: 0.3, angulo: -Math.PI / 9 },
      // Cola de la flecha (abajo): rayo converge hacia arriba-derecha al cruzar el agujero
      { tipo: 'fuente', x: -0.6, y: -0.3, angulo: Math.PI / 9 },
    ],
  },

  objetivo: {
    tipo: 'pinhole',
  },
};
