import { describe, it, expect } from 'vitest';
import { conceptosEnRuta, estaDesbloqueado, CONCEPTOS } from '../graph';

describe('graph — conceptosEnRuta', () => {
  it('ruta pedagógica devuelve conceptos ordenados por ordenPedagogico', () => {
    const ruta = conceptosEnRuta('pedagogica');
    for (let i = 1; i < ruta.length; i++) {
      expect(ruta[i]!.ordenPedagogico).toBeGreaterThan(ruta[i - 1]!.ordenPedagogico);
    }
  });

  it('ruta histórica devuelve conceptos ordenados por fechaHistorica', () => {
    const ruta = conceptosEnRuta('historica');
    for (let i = 1; i < ruta.length; i++) {
      expect(ruta[i]!.fechaHistorica).toBeGreaterThanOrEqual(ruta[i - 1]!.fechaHistorica);
    }
  });

  it('ambas rutas contienen los mismos conceptos', () => {
    const p = conceptosEnRuta('pedagogica').map(c => c.id).sort();
    const h = conceptosEnRuta('historica').map(c => c.id).sort();
    expect(p).toEqual(h);
  });

  it('no muta el array CONCEPTOS original', () => {
    const antes = CONCEPTOS.map(c => c.id);
    conceptosEnRuta('pedagogica');
    conceptosEnRuta('historica');
    const despues = CONCEPTOS.map(c => c.id);
    expect(antes).toEqual(despues);
  });
});

describe('graph — estaDesbloqueado', () => {
  it('rayo (sin prereqs) está desbloqueado siempre', () => {
    expect(estaDesbloqueado('rayo', [])).toBe(true);
  });

  it('refraccion (sin prereqs) está desbloqueado siempre', () => {
    expect(estaDesbloqueado('refraccion', [])).toBe(true);
  });

  it('fermat requiere refraccion — bloqueado si refraccion no está completada', () => {
    expect(estaDesbloqueado('fermat', [])).toBe(false);
  });

  it('fermat se desbloquea cuando refraccion está completada', () => {
    expect(estaDesbloqueado('fermat', ['refraccion'])).toBe(true);
  });

  it('lentes requiere refraccion Y reflexion', () => {
    expect(estaDesbloqueado('lentes', ['refraccion'])).toBe(false);
    expect(estaDesbloqueado('lentes', ['reflexion'])).toBe(false);
    expect(estaDesbloqueado('lentes', ['refraccion', 'reflexion'])).toBe(true);
  });

  it('id desconocido devuelve false', () => {
    expect(estaDesbloqueado('noexiste', ['rayo'])).toBe(false);
  });
});
