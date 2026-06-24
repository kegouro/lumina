// Capítulo Instrumentos ópticos — sistemas multi-elemento.
// Banco: dos lentes sobre el eje (objetivo + ocular). Rayos de un objeto
// lejano (casi paralelos) atraviesan ambas y salen magnificados angularmente.
// Interacción: ajustar la separación d entre las lentes.
// Config afocal: d ≈ f₁ + f₂ → los rayos salen paralelos y el aumento
// angular = f₁/f₂.
// Objetivo: lograr la configuración afocal (telescopio funcionando).

import type { Capitulo } from './types';

// Focales (unidades normalizadas bench)
const F1_NORM = 0.38;   // objetivo (focal larga)
const F2_NORM = 0.18;   // ocular (focal corta)
// Separación inicial: algo diferente de f1+f2 para que haya que ajustar
const SEP_INICIAL = 0.40;

export const capituloInstrumentos: Capitulo = {
  conceptoId: 'instrumentos',

  escena: {
    fraseKey: 'instrumentos.frase',
    tituloKey: 'instrumentos.titulo',
    intuicionKey: 'instrumentos.intuicion',
    deduccionTituloKey: 'instrumentos.deduccion.titulo',
    deduccionTextoKey: 'instrumentos.deduccion.texto',
    deduccionDerivacionKey: 'instrumentos.deduccion.derivacion',
    deduccionVerKey: 'instrumentos.deduccion.ver',
    deduccionOcultarKey: 'instrumentos.deduccion.ocultar',
    comenzarKey: 'instrumentos.comenzar',
  },

  // Banco: fuente a distancia lejana (casi paralela), lente1 (objetivo) en x=-0.2,
  // lente2 (ocular) en x = -0.2 + separacion
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.90, y: 0, angulo: 0 },
      { tipo: 'lente', x: -0.20, f: F1_NORM },
      { tipo: 'lente', x: -0.20 + SEP_INICIAL, f: F2_NORM },
    ],
  },

  objetivo: {
    tipo: 'instrumentos',
    f1: F1_NORM,
    f2: F2_NORM,
    tolerancia: 0.05, // ±5 % de (f1+f2) para considerar afocal
  },
};
