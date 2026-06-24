// Capítulo "Principio de Fermat" — clímax conceptual del Acto I.
// El principio unificador: reflexión y refracción como casos del mismo mínimo.
// Objetivo tipo fermat-reflexion: minimizar el camino sobre el espejo (n1=n2=1).

import type { Capitulo } from './types';

export const capituloFermat: Capitulo = {
  conceptoId: 'fermat',

  escena: {
    fraseKey: 'fermat.frase',
    tituloKey: 'fermat.titulo.escena',
    intuicionKey: 'fermat.intuicion',
    deduccionTituloKey: 'fermat.deduccion.titulo',
    deduccionTextoKey: 'fermat.deduccion.texto',
    deduccionDerivacionKey: 'fermat.deduccion.derivacion',
    deduccionVerKey: 'fermat.deduccion.ver',
    deduccionOcultarKey: 'fermat.deduccion.ocultar',
    comenzarKey: 'fermat.comenzar',
  },

  // Espejo plano en x=0: A y B están en el mismo lado (x<0),
  // el rayo rebota en el espejo para ir de A a B.
  escenaBanco: {
    elementos: [
      { tipo: 'fuente', x: -0.6, y: 0.3, angulo: -Math.PI / 6 },
      { tipo: 'espejo-plano', x: 0, angulo: 0 },
    ],
  },

  // Con n1=n2=1 (reflexión), calcularCaminoOptico minimiza igual que Snell.
  // A y B en x<0 — el camino óptimo satisface θᵢ = θᵣ.
  objetivo: {
    tipo: 'fermat-reflexion',
    A: { x: -0.55, y: 0.3 },
    B: { x: -0.55, y: -0.3 },
  },
};
