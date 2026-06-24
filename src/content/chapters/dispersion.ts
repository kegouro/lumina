// Capítulo Dispersión y color — el prisma de Newton.
// Banco: un prisma BK7 triangular con un rayo blanco entrante que se abre en espectro.
// La interacción: girar el ángulo de incidencia (arrastrando) desplaza el abanico.
// La colorimetría usa wavelengthToSRGB (CIE 1931) — no RGB ingenuo.

import type { Capitulo } from './types';

export const capituloDispersion: Capitulo = {
  conceptoId: 'dispersion',

  escena: {
    fraseKey: 'dispersion.frase',
    tituloKey: 'dispersion.titulo',
    intuicionKey: 'dispersion.intuicion',
    deduccionTituloKey: 'dispersion.deduccion.titulo',
    deduccionTextoKey: 'dispersion.deduccion.texto',
    deduccionDerivacionKey: 'dispersion.deduccion.derivacion',
    deduccionVerKey: 'dispersion.deduccion.ver',
    deduccionOcultarKey: 'dispersion.deduccion.ocultar',
    comenzarKey: 'dispersion.comenzar',
  },

  // Banco: fuente + prisma BK7 centrado en x=0
  escenaBanco: {
    elementos: [
      // Fuente puntual de luz blanca a la izquierda
      { tipo: 'fuente', x: -0.65, y: 0, angulo: Math.PI / 8 },
      // Prisma triangular BK7 (ápice 45°, primera cara en x=0)
      {
        tipo: 'prisma',
        x: 0,
        anguloApice: Math.PI / 4,   // 45°
        material: 'BK7',
        lambda: 550,                // longitud de onda de referencia (verde)
      },
    ],
  },

  objetivo: {
    tipo: 'dispersion',
    toleranciaGrados: 3,  // ±3° respecto a la desviación mínima para considerar objetivo cumplido
  },
};
