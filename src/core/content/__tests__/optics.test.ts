import { describe, it, expect } from 'vitest';
import { trazarRayos } from '../optics';
import type { EscenaOptica } from '../optics';

describe('trazarRayos — escena vacía o sin fuente', () => {
  it('devuelve array vacío si no hay fuente', () => {
    const escena: EscenaOptica = { elementos: [] };
    expect(trazarRayos(escena, 1)).toEqual([]);
  });

  it('con solo fuente, traza hasta xFin en línea recta', () => {
    const escena: EscenaOptica = {
      elementos: [{ tipo: 'fuente', x: -0.5, y: 0, angulo: 0 }],
    };
    const puntos = trazarRayos(escena, 0.5);
    expect(puntos).toHaveLength(2);
    expect(puntos[0]).toMatchObject({ x: -0.5, y: 0 });
    expect(puntos[1]!.x).toBeCloseTo(0.5, 5);
    expect(puntos[1]!.y).toBeCloseTo(0, 5); // ángulo 0 = rayo horizontal
  });
});

describe('trazarRayos — interfaz (Snell exacto)', () => {
  it('rayo horizontal no se refracta (θ=0)', () => {
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: 0 },
        { tipo: 'interfaz', x: 0, n1: 1.0, n2: 1.33 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    // Tres puntos: fuente, cruce interfaz, fin
    expect(puntos).toHaveLength(3);
    // El cruce está en x=0, y=0 (rayo horizontal)
    expect(puntos[1]!.x).toBeCloseTo(0, 5);
    expect(puntos[1]!.y).toBeCloseTo(0, 5);
    // Ángulo refractado ≈ 0, así que el punto final también y≈0
    expect(puntos[2]!.y).toBeCloseTo(0, 5);
  });

  it('rayo a 30° se refracta correctamente en agua (Snell verifica)', () => {
    const theta1 = Math.PI / 6; // 30°
    const n1 = 1.0;
    const n2 = 1.33;
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: theta1 },
        { tipo: 'interfaz', x: 0, n1, n2 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    expect(puntos).toHaveLength(3);
    // Verificar Snell: ángulo θ2 = asin(n1*sin(θ1)/n2)
    const theta2Esperado = Math.asin((n1 * Math.sin(theta1)) / n2);
    // Calcular ángulo real del último segmento
    const dx = puntos[2]!.x - puntos[1]!.x;
    const dy = puntos[2]!.y - puntos[1]!.y;
    const anguloReal = Math.atan2(dy, dx);
    expect(anguloReal).toBeCloseTo(theta2Esperado, 4);
  });

  it('TIR: el rayo supercrítico no cruza la interfaz y se marca como TIR', () => {
    const n1 = 1.33;
    const n2 = 1.0;
    const anguloCritico = Math.asin(n2 / n1);
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: anguloCritico + 0.05 },
        { tipo: 'interfaz', x: 0, n1, n2 },
      ],
    };
    const puntos = trazarRayos(escena, 0.5);
    // El punto de cruce debe estar marcado como TIR
    const cruceTIR = puntos.find(p => p.tir === true);
    expect(cruceTIR).toBeDefined();
  });
});

describe('trazarRayos — espejo plano', () => {
  it('espejo vertical (angulo=0) refleja un rayo horizontal hacia atrás', () => {
    const escena: EscenaOptica = {
      elementos: [
        { tipo: 'fuente', x: -0.5, y: 0, angulo: 0 },
        { tipo: 'espejo-plano', x: 0, angulo: 0 },
      ],
    };
    // Tras reflejar, el rayo va hacia la izquierda: xFin < 0
    const puntos = trazarRayos(escena, -0.5);
    expect(puntos).toHaveLength(3);
    // El punto reflejado final debe estar a la izquierda del espejo
    expect(puntos[2]!.x).toBeLessThan(0);
  });
});
