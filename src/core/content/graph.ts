// Grafo de conceptos del Acto I de Lumina.
// Cada concepto tiene id, título, orden pedagógico, fecha histórica y prerequisitos.
// Los helpers son PUROS: sin DOM, sin estado global.

/** Un concepto/capítulo del curso */
export interface Concepto {
  id: string;
  titulo: string;
  /** Orden en la ruta pedagógica (1-based) */
  ordenPedagogico: number;
  /** Año histórico aproximado del descubrimiento (negativo = a.C.) */
  fechaHistorica: number;
  /** IDs de conceptos que deben estar completados antes de este */
  prereqs: string[];
  /** Herramienta que desbloquea al completar */
  herramienta?: string;
}

/** Registro de todos los conceptos del Acto I */
export const CONCEPTOS: Concepto[] = [
  {
    id: 'rayo',
    titulo: 'El rayo de luz',
    ordenPedagogico: 1,
    fechaHistorica: -300,
    prereqs: [],
    herramienta: 'fuente',
  },
  {
    id: 'reflexion',
    titulo: 'Reflexión',
    ordenPedagogico: 2,
    fechaHistorica: -300,
    prereqs: ['rayo'],
    herramienta: 'espejo-plano',
  },
  {
    id: 'refraccion',
    titulo: 'Refracción',
    ordenPedagogico: 3,
    fechaHistorica: 1621,
    prereqs: ['reflexion'],
    herramienta: 'interfaz',
  },
  {
    id: 'fermat',
    titulo: 'Principio de Fermat',
    ordenPedagogico: 4,
    fechaHistorica: 1662,
    prereqs: ['refraccion', 'reflexion'],
  },
  {
    id: 'dispersion',
    titulo: 'Dispersión y color',
    ordenPedagogico: 5,
    fechaHistorica: 1672,
    prereqs: ['refraccion'],
    herramienta: 'espectrómetro',
  },
  {
    id: 'lentes',
    titulo: 'Lentes y espejos curvos',
    ordenPedagogico: 6,
    fechaHistorica: 1604,
    prereqs: ['refraccion', 'reflexion'],
    herramienta: 'lente-delgada',
  },
  {
    id: 'aberraciones',
    titulo: 'Aberraciones',
    ordenPedagogico: 7,
    fechaHistorica: 1856,
    prereqs: ['lentes'],
  },
  {
    id: 'instrumentos',
    titulo: 'Instrumentos ópticos',
    ordenPedagogico: 8,
    fechaHistorica: 1608,
    prereqs: ['lentes'],
    herramienta: 'sistema-multi-elemento',
  },
];

/**
 * Devuelve los conceptos ordenados según la ruta elegida.
 * 'pedagogica': por ordenPedagogico ascendente.
 * 'historica': por fechaHistorica ascendente.
 */
export function conceptosEnRuta(ruta: 'pedagogica' | 'historica'): Concepto[] {
  const copia = [...CONCEPTOS];
  if (ruta === 'pedagogica') {
    copia.sort((a, b) => a.ordenPedagogico - b.ordenPedagogico);
  } else {
    copia.sort((a, b) => a.fechaHistorica - b.fechaHistorica);
  }
  return copia;
}

/**
 * Determina si un concepto está desbloqueado dado el conjunto de completados.
 * Un concepto está desbloqueado cuando todos sus prereqs están en `completados`.
 */
export function estaDesbloqueado(id: string, completados: string[]): boolean {
  const concepto = CONCEPTOS.find(c => c.id === id);
  if (!concepto) return false;
  return concepto.prereqs.every(req => completados.includes(req));
}
