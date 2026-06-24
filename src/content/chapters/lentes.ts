// Capítulo Lentes y espejos curvos — la lente delgada de Gauss.
// Banco: una lente convergente + objeto flecha arrastrable.
// Un abanico de rayos refracta por la lente y converge en la imagen.
// HUD muestra s, s′, m, f en tiempo real.
// Objetivo: colocar el objeto en 2f → m = −1.

import type { Capitulo } from './types';

// Distancia focal de la lente en unidades normalizadas bench (mitad del canvas ≈ 1)
// f = 0.30 (30 % del semiancho) da una lente convergente cómoda de visualizar.
const F_NORM = 0.30;

export const capituloLentes: Capitulo = {
  conceptoId: 'lentes',

  escena: {
    fraseKey: 'lentes.frase',
    tituloKey: 'lentes.titulo',
    intuicionKey: 'lentes.intuicion',
    deduccionTituloKey: 'lentes.deduccion.titulo',
    deduccionTextoKey: 'lentes.deduccion.texto',
    deduccionDerivacionKey: 'lentes.deduccion.derivacion',
    deduccionVerKey: 'lentes.deduccion.ver',
    deduccionOcultarKey: 'lentes.deduccion.ocultar',
    comenzarKey: 'lentes.comenzar',
  },

  // Banco: fuente (representará la punta del objeto) + lente en x=0
  escenaBanco: {
    elementos: [
      // La fuente marca la posición del objeto (se arrastrará vía pinholeObjX que reutilizamos)
      { tipo: 'fuente', x: -0.60, y: 0.15, angulo: 0 },
      // Lente delgada convergente en x=0, f=0.30 norm
      { tipo: 'lente', x: 0, f: F_NORM },
    ],
  },

  objetivo: {
    tipo: 'lentes',
    f: F_NORM,
    tolerancia: 0.08,  // ±8 % de 2f para considerar objetivo cumplido
  },
};
