// Banco óptico Canvas2D — capítulo Refracción (y capítulos posteriores).
// Dibuja: eje óptico, interfaz vertical, rayo incidente + refractado (Snell exacto),
// reflexión total interna cuando aplica, punto de cruce P para Fermat,
// espectro de dispersión del prisma (capítulo dispersión),
// abanico + imagen de lente (capítulo lentes).
// Interacción: arrastre del extremo del rayo incidente cambia θ₁.
// Pulso de propagación: al soltar, el rayo "viaja" desde la fuente.

import { refract, criticalAngle } from '../../core/snell';
import { DOMAIN_COLORS, wavelengthToSRGB } from '../../core/colors';
import type { EscenaOptica } from '../../core/content/optics';
import { trazarRayos } from '../../core/content/optics';
import { nSellmeier, prismaDesviacion, desviacionMinima } from '../../core/dispersion';
import type { MaterialOptico } from '../../core/dispersion';
import { imagenParaxialLente, trazarAbanico } from '../../core/imaging';
import { aberracionEsferica, aberracionCromatica } from '../../core/aberration';

export interface BenchConfig {
  canvas: HTMLCanvasElement;
  n1: number;
  n2: number;
  thetaInc: number;          // radianes, positivo = hacia arriba desde el eje
  fermatMode: boolean;
  /** Escena óptica declarativa; si se provee, el banco usa trazarRayos() */
  escena?: EscenaOptica;
  /** Modo cámara oscura: visualización pinhole dedicada */
  pinholeMode?: boolean;
  /** Tamaño normalizado del agujero pinhole (0.01–0.3) */
  pinholeSize?: number;
  /** Posición x normalizada del objeto flecha */
  objetoX?: number;
  /** Posición y normalizada del blanco de reflexión (solo capítulo reflexion-blanco) */
  blancoY?: number;
  /** Tolerancia normalizada para resaltar el blanco como impactado */
  blancoTolerancia?: number;
  /** Modo dispersión: dibuja espectro completo del prisma */
  dispersionMode?: boolean;
  /** Modo lentes: dibuja abanico de rayos + imagen */
  lentesMode?: boolean;
  /** Distancia focal de la lente en unidades norm (solo lentesMode) */
  lentesF?: number;
  /** Posición x normalizada del objeto para el modo lentes (arrastrable) */
  lentesObjX?: number;
  /** Modo aberraciones: abanico multi-altura con mancha de desenfoque */
  aberracionesMode?: boolean;
  /** Focal de la lente en modo aberraciones */
  aberracionesF?: number;
  /** Apertura actual normalizada del diafragma (0..1 donde 1 = apertura máxima) */
  apertura?: number;
  /** Apertura máxima normalizada en modo aberraciones */
  aperturaMax?: number;
  /** Modo instrumentos: dos lentes, separación ajustable */
  instrumentosMode?: boolean;
  /** Focal de la lente 1 (objetivo) en modo instrumentos */
  instrumentosF1?: number;
  /** Focal de la lente 2 (ocular) en modo instrumentos */
  instrumentosF2?: number;
  /** Separación entre las dos lentes en modo instrumentos */
  instrumentosSeparacion?: number;
  /** Callback cuando cambia la apertura en modo aberraciones */
  onAperturaChange?: (apertura: number) => void;
  /** Callback cuando cambia la separación en modo instrumentos */
  onSeparacionChange?: (separacion: number) => void;
  onAngleChange: (theta: number) => void;
  onFermatPChange: (py: number) => void;  // py en coordenadas bench norm [-1, 1]
  onPinholeSizeChange?: (size: number) => void;
  /** Callback cuando cambia la posición del objeto en modo lentes */
  onLentesObjChange?: (objX: number) => void;
}

// ── Funciones puras exportadas (testeables sin DOM) ──────────────────────────

/** Llama a refract() del core — envoltorio semántico para tests. */
export function calcularRefraccion(n1: number, n2: number, thetaInc: number) {
  return refract(n1, n2, thetaInc);
}

/**
 * Camino óptico L(P) = n1 * |AP| + n2 * |PB|.
 * A y B son puntos 2D; P está en x=0 con ordenada `py`.
 */
export function calcularCaminoOptico(
  n1: number,
  n2: number,
  A: { x: number; y: number },
  B: { x: number; y: number },
  py: number
): number {
  const dAP = Math.sqrt(A.x * A.x + (A.y - py) * (A.y - py));
  const dPB = Math.sqrt(B.x * B.x + (B.y - py) * (B.y - py));
  return n1 * dAP + n2 * dPB;
}

/**
 * Encuentra el py que minimiza el camino óptico de Fermat usando búsqueda ternaria.
 * Busca en el rango [minPy, maxPy] con 80 iteraciones.
 */
export function encontrarMinimoFermat(
  n1: number,
  n2: number,
  A: { x: number; y: number },
  B: { x: number; y: number },
  minPy = -2,
  maxPy = 2
): number {
  let lo = minPy;
  let hi = maxPy;
  for (let i = 0; i < 80; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (calcularCaminoOptico(n1, n2, A, B, m1) < calcularCaminoOptico(n1, n2, A, B, m2)) {
      hi = m2;
    } else {
      lo = m1;
    }
  }
  return (lo + hi) / 2;
}

// ── Clase Bench ──────────────────────────────────────────────────────────────

export class Bench {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: BenchConfig;

  // Estado interno del dibujo
  private n1: number;
  private n2: number;
  private thetaInc: number;
  private fermatMode: boolean;
  private escena: EscenaOptica | undefined;
  private fermatPy: number = 0;  // py normalizado en coordenadas "bench" (no canvas px)

  // Interacción
  private dragging: boolean = false;
  private dragTarget: 'ray' | 'fermat' | 'pinhole-obj' | null = null;

  // Modo cámara oscura (pinhole)
  private pinholeMode: boolean = false;
  private pinholeSize: number = 0.08;   // tamaño normalizado del agujero
  private objetoX: number = -0.55;      // posición x del objeto flecha (norm)
  private animFrame: number | null = null;
  private pulseProgress: number = 1;  // 0..1 para el pulso de propagación

  // Blanco de reflexión
  private blancoY: number | null = null;      // posición y normalizada del blanco
  private blancoTolerancia: number = 0.08;    // tolerancia para el highlight
  private blancoImpactado: boolean = false;   // ¿el rayo pasa por el blanco?

  // Dispersión
  private dispersionMode: boolean = false;

  // Lentes
  private lentesMode: boolean = false;
  private lentesF: number = 0.30;
  private lentesObjX: number = -0.60;   // posición x del objeto arrastrable

  // Aberraciones
  private aberracionesMode: boolean = false;
  private aberracionesF: number = 0.30;
  private apertura: number = 1.0;        // 0 (cerrado) .. 1 (máxima apertura)
  private aperturaMax: number = 0.45;

  // Instrumentos
  private instrumentosMode: boolean = false;
  private instrumentosF1: number = 0.38;
  private instrumentosF2: number = 0.18;
  private instrumentosSeparacion: number = 0.40;

  // Geometría del bench en píxeles (se recalcula en resize)
  private W = 0;
  private H = 0;
  private CX = 0;  // coordenada X de la interfaz
  private CY = 0;  // coordenada Y del eje óptico

  // Fuente de rayo: siempre a la izquierda
  private readonly SOURCE_X_NORM = -0.6;  // fracción de la mitad de ancho
  private readonly SOURCE_Y_NORM = -0.25; // fracción de la mitad de alto (arriba)

  // Fermat: puntos A y B fijos en coordenadas "bench norm"
  private readonly FERMAT_A = { x: -0.55, y: -0.3 };  // medio 1
  private readonly FERMAT_B = { x:  0.55, y:  0.22 }; // medio 2

  constructor(config: BenchConfig) {
    this.config = config;
    this.canvas = config.canvas;
    this.n1 = config.n1;
    this.n2 = config.n2;
    this.thetaInc = config.thetaInc;
    this.fermatMode = config.fermatMode;
    this.escena = config.escena;
    this.pinholeMode = config.pinholeMode ?? false;
    if (config.pinholeSize !== undefined) this.pinholeSize = config.pinholeSize;
    if (config.objetoX !== undefined) this.objetoX = config.objetoX;
    if (config.blancoY !== undefined) this.blancoY = config.blancoY;
    if (config.blancoTolerancia !== undefined) this.blancoTolerancia = config.blancoTolerancia;
    if (config.dispersionMode !== undefined) this.dispersionMode = config.dispersionMode;
    if (config.lentesMode !== undefined) this.lentesMode = config.lentesMode;
    if (config.lentesF !== undefined) this.lentesF = config.lentesF;
    if (config.lentesObjX !== undefined) this.lentesObjX = config.lentesObjX;
    if (config.aberracionesMode !== undefined) this.aberracionesMode = config.aberracionesMode;
    if (config.aberracionesF !== undefined) this.aberracionesF = config.aberracionesF;
    if (config.apertura !== undefined) this.apertura = config.apertura;
    if (config.aperturaMax !== undefined) this.aperturaMax = config.aperturaMax;
    if (config.instrumentosMode !== undefined) this.instrumentosMode = config.instrumentosMode;
    if (config.instrumentosF1 !== undefined) this.instrumentosF1 = config.instrumentosF1;
    if (config.instrumentosF2 !== undefined) this.instrumentosF2 = config.instrumentosF2;
    if (config.instrumentosSeparacion !== undefined) this.instrumentosSeparacion = config.instrumentosSeparacion;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo obtener el contexto 2D del canvas');
    this.ctx = ctx;

    this.resize();
    this.bindEvents();
    this.loop();
  }

  /** Actualiza parámetros del estado externo */
  updateState(s: Partial<BenchConfig>): void {
    if (s.n1 !== undefined) this.n1 = s.n1;
    if (s.n2 !== undefined) this.n2 = s.n2;
    if (s.thetaInc !== undefined) this.thetaInc = s.thetaInc;
    if (s.fermatMode !== undefined) this.fermatMode = s.fermatMode;
    if (s.escena !== undefined) this.escena = s.escena;
    if (s.pinholeMode !== undefined) this.pinholeMode = s.pinholeMode;
    if (s.pinholeSize !== undefined) this.pinholeSize = s.pinholeSize;
    if (s.objetoX !== undefined) this.objetoX = s.objetoX;
    if (s.blancoY !== undefined) this.blancoY = s.blancoY;
    if (s.blancoTolerancia !== undefined) this.blancoTolerancia = s.blancoTolerancia;
    if (s.dispersionMode !== undefined) this.dispersionMode = s.dispersionMode;
    if (s.lentesMode !== undefined) this.lentesMode = s.lentesMode;
    if (s.lentesF !== undefined) this.lentesF = s.lentesF;
    if (s.lentesObjX !== undefined) this.lentesObjX = s.lentesObjX;
    if (s.aberracionesMode !== undefined) this.aberracionesMode = s.aberracionesMode;
    if (s.aberracionesF !== undefined) this.aberracionesF = s.aberracionesF;
    if (s.apertura !== undefined) this.apertura = s.apertura;
    if (s.aperturaMax !== undefined) this.aperturaMax = s.aperturaMax;
    if (s.instrumentosMode !== undefined) this.instrumentosMode = s.instrumentosMode;
    if (s.instrumentosF1 !== undefined) this.instrumentosF1 = s.instrumentosF1;
    if (s.instrumentosF2 !== undefined) this.instrumentosF2 = s.instrumentosF2;
    if (s.instrumentosSeparacion !== undefined) this.instrumentosSeparacion = s.instrumentosSeparacion;
    this.triggerPulse();
  }

  /** Notifica al banco si el rayo reflejado impacta el blanco (para resaltarlo) */
  setBlancoImpactado(impactado: boolean): void {
    this.blancoImpactado = impactado;
  }

  /** Lanza el pulso de propagación */
  private triggerPulse(): void {
    // Si el usuario prefiere movimiento reducido, saltamos la animación
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.pulseProgress = 1;
      return;
    }
    this.pulseProgress = 0;
  }

  /** Redimensiona el canvas al tamaño del contenedor */
  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio ?? 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.W = rect.width;
    this.H = rect.height;
    this.CX = this.W / 2;
    this.CY = this.H / 2;
  }

  // ── Conversiones coordenadas ──────────────────────────────────────────────

  /** Coordenadas "norm" [-1,1] x [-1,1] → píxeles del canvas */
  private normToPx(nx: number, ny: number): { x: number; y: number } {
    return {
      x: this.CX + nx * this.CX,
      y: this.CY - ny * this.CY,  // y positivo = arriba
    };
  }

  /** Píxeles → coordenadas norm */
  private pxToNorm(px: number, py: number): { x: number; y: number } {
    return {
      x: (px - this.CX) / this.CX,
      y: -(py - this.CY) / this.CY,
    };
  }

  // ── Dibujo ────────────────────────────────────────────────────────────────

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    if (this.pinholeMode) {
      // La cámara oscura tiene su propio fondo y no usa medios/interfaz
      this.drawPinhole();
      return;
    }

    if (this.dispersionMode) {
      this.drawDispersion();
      return;
    }

    if (this.lentesMode) {
      this.drawLentes();
      return;
    }

    if (this.aberracionesMode) {
      this.drawAberraciones();
      return;
    }

    if (this.instrumentosMode) {
      this.drawInstrumentos();
      return;
    }

    this.drawMedios();
    this.drawInterface();
    this.drawEjeOptico();

    if (this.fermatMode) {
      this.drawFermatPoints();
      this.drawFermatPath();
    } else {
      this.drawRay();
    }

    // Dibujar blanco de reflexión si está configurado
    if (this.blancoY !== null) {
      this.drawBlanco(this.blancoY, this.blancoImpactado);
    }
  }

  /** Dibuja los dos medios con tinte sutil */
  private drawMedios(): void {
    const ctx = this.ctx;
    // Medio 1 (izquierda): ligeramente más cálido
    ctx.fillStyle = 'rgba(245, 167, 44, 0.03)';
    ctx.fillRect(0, 0, this.CX, this.H);
    // Medio 2 (derecha): tinte azul-agua
    ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
    ctx.fillRect(this.CX, 0, this.CX, this.H);
  }

  /** Dibuja la interfaz vertical */
  private drawInterface(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(this.CX, 0);
    ctx.lineTo(this.CX, this.H);
    ctx.stroke();
    ctx.restore();
  }

  /** Dibuja el eje óptico */
  private drawEjeOptico(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(154, 138, 118, 0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, this.CY);
    ctx.lineTo(this.W, this.CY);
    ctx.stroke();
    ctx.restore();
  }

  /**
   * Dibuja el blanco de reflexión: diana circular en la posición y dada.
   * Se coloca en el lado derecho del canvas (x normalizado ≈ 0.75).
   * Cuando impactado=true se ilumina con glow dorado.
   */
  private drawBlanco(blancoYNorm: number, impactado: boolean): void {
    const ctx = this.ctx;
    // El blanco se sitúa en el lado derecho del banco (x=0.75 normalizado)
    const pos = this.normToPx(0.75, blancoYNorm);
    const r = 14;
    const colorOuter = impactado ? '#f5a72c' : 'rgba(56,189,248,0.55)';
    const colorInner = impactado ? '#ffe08a' : 'rgba(239,231,216,0.25)';

    ctx.save();

    if (impactado) {
      // Glow dorado al impactar
      ctx.shadowColor = '#f5a72c';
      ctx.shadowBlur = 28;
    }

    // Anillo exterior
    ctx.strokeStyle = colorOuter;
    ctx.lineWidth = impactado ? 2.5 : 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    ctx.stroke();

    // Anillo medio
    ctx.strokeStyle = colorOuter;
    ctx.lineWidth = impactado ? 2 : 1;
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r * 0.6, 0, Math.PI * 2);
    ctx.stroke();

    // Punto central
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = impactado ? '#f5a72c' : colorInner;
    ctx.shadowBlur = impactado ? 14 : 0;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, r * 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Línea guía punteada desde el eje hasta el blanco
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = 'rgba(154,138,118,0.5)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(this.CX, pos.y);
    ctx.lineTo(pos.x - r, pos.y);
    ctx.stroke();

    ctx.restore();
  }

  /** Despacha al trazador nuevo (EscenaOptica) o al legacy según configuración */
  private drawRay(): void {
    if (this.escena) {
      this.drawRayDesdeEscena();
    } else {
      this.drawRayLegacy();
    }
  }

  /**
   * Dibuja el rayo usando trazarRayos() sobre la EscenaOptica declarativa.
   * Sobreescribe el ángulo/índices con el estado interactivo actual.
   */
  private drawRayDesdeEscena(): void {
    if (!this.escena) return;
    const ctx = this.ctx;

    // Construir escena con el estado interactivo actual
    const escenaActual: EscenaOptica = {
      elementos: this.escena.elementos.map(el => {
        if (el.tipo === 'fuente') {
          return { ...el, angulo: this.thetaInc };
        }
        if (el.tipo === 'interfaz') {
          return { ...el, n1: this.n1, n2: this.n2 };
        }
        return el;
      }),
    };

    const puntos = trazarRayos(escenaActual, 0.95);
    if (puntos.length < 2) return;

    const rayColor = DOMAIN_COLORS.ray;
    const segCount = puntos.length - 1;
    const segSize = 1 / segCount;

    for (let i = 0; i < segCount; i++) {
      const from = this.normToPx(puntos[i]!.x, puntos[i]!.y);
      const to   = this.normToPx(puntos[i + 1]!.x, puntos[i + 1]!.y);
      // El color TIR se aplica al segmento saliente tras el punto marcado
      const esTIR = puntos[i]!.tir === true;
      const color = esTIR ? '#ff7a3c' : rayColor;
      this.drawSegmentAA(ctx, from, to, color, 2.0, this.pulseProgress, i * segSize, (i + 1) * segSize);
    }

    // Marcador de la fuente
    const fuenteEl = escenaActual.elementos.find(e => e.tipo === 'fuente');
    if (fuenteEl && fuenteEl.tipo === 'fuente') {
      const src = this.normToPx(fuenteEl.x, fuenteEl.y);
      ctx.save();
      ctx.fillStyle = rayColor;
      ctx.shadowColor = rayColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(src.x, src.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Marcador del punto de cruce (primer punto tras la fuente)
    if (puntos.length >= 2) {
      const cruce = this.normToPx(puntos[1]!.x, puntos[1]!.y);
      ctx.save();
      ctx.strokeStyle = 'rgba(245,167,44,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cruce.x, cruce.y, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Ángulo crítico indicator (arco en el punto de cruce)
    const interfazEl = escenaActual.elementos.find(e => e.tipo === 'interfaz');
    if (interfazEl && interfazEl.tipo === 'interfaz' && puntos.length >= 2) {
      const cruce = this.normToPx(puntos[1]!.x, puntos[1]!.y);
      const ca = criticalAngle(interfazEl.n1, interfazEl.n2);
      if (ca !== null) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 122, 60, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(cruce.x, cruce.y, 40, -Math.PI / 2, -Math.PI / 2 + ca);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  /** Dibuja el sistema de rayo con Snell exacto + pulso de propagación (modo legacy sin EscenaOptica) */
  private drawRayLegacy(): void {
    const ctx = this.ctx;
    const result = refract(this.n1, this.n2, this.thetaInc);

    // Fuente del rayo
    const src = this.normToPx(this.SOURCE_X_NORM, this.SOURCE_Y_NORM);
    // El rayo va desde src con ángulo thetaInc hasta la interfaz x=CX
    const dxInc = this.CX - src.x;
    const dyInc = dxInc * Math.tan(-this.thetaInc);  // y crece hacia abajo en canvas
    const cruce = { x: this.CX, y: src.y + dyInc };

    // Destino del rayo refractado/reflejado
    let dest: { x: number; y: number };
    const rayColor = DOMAIN_COLORS.ray;

    if (result.tir) {
      // Reflexión total interna: el rayo rebota
      const dxRef = this.CX - src.x;
      const dyRef = -dyInc;  // simetría especular
      dest = { x: this.CX - dxRef * 0.5, y: cruce.y + dyRef * 0.5 };
      this.drawSegmentAA(ctx, src, cruce, rayColor, 2.0, this.pulseProgress, 0, 0.5);
      this.drawSegmentAA(ctx, cruce, dest, '#ff7a3c', 1.8, this.pulseProgress, 0.5, 1.0);
    } else {
      // Refracción: continúa en medio 2
      const dxRef = this.W - this.CX;
      const dyRef = dxRef * Math.tan(-result.theta);
      dest = { x: this.W - 20, y: cruce.y + dyRef };
      this.drawSegmentAA(ctx, src, cruce, rayColor, 2.0, this.pulseProgress, 0, 0.5);
      this.drawSegmentAA(ctx, cruce, dest, rayColor, 2.0, this.pulseProgress, 0.5, 1.0);
    }

    // Marcador de la fuente
    ctx.save();
    ctx.fillStyle = rayColor;
    ctx.shadowColor = rayColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(src.x, src.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Marcador del punto de cruce
    ctx.save();
    ctx.strokeStyle = 'rgba(245,167,44,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cruce.x, cruce.y, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Ángulo crítico indicator (arco)
    const ca = criticalAngle(this.n1, this.n2);
    if (ca !== null) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 122, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      const r = 40;
      ctx.beginPath();
      ctx.arc(cruce.x, cruce.y, r, -Math.PI / 2, -Math.PI / 2 + ca);
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Dibuja un segmento con antialiasing (línea con halo).
   * `pulseT` en [0,1] anima la longitud visible del segmento si < 1.
   * `segStart` y `segEnd` son fracciones del pulso total asignadas a este segmento.
   */
  private drawSegmentAA(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    width: number,
    pulseT: number,
    segStart: number,
    segEnd: number
  ): void {
    // Fracción del segmento actualmente visible según el pulso
    const segRange = segEnd - segStart;
    const localT = Math.max(0, Math.min(1, (pulseT - segStart) / segRange));
    if (localT <= 0) return;

    const ex = from.x + (to.x - from.x) * localT;
    const ey = from.y + (to.y - from.y) * localT;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Capa difusa (halo para antialiasing)
    ctx.strokeStyle = color;
    ctx.lineWidth = width + 2;
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();

    // Línea principal
    ctx.globalAlpha = 1.0;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.restore();
  }

  /** Dibuja puntos A y B del modo Fermat */
  private drawFermatPoints(): void {
    const ctx = this.ctx;
    const A = this.normToPx(this.FERMAT_A.x, this.FERMAT_A.y);
    const B = this.normToPx(this.FERMAT_B.x, this.FERMAT_B.y);
    const P = this.normToPx(0, this.fermatPy);

    // Punto A
    ctx.save();
    ctx.fillStyle = DOMAIN_COLORS.ray;
    ctx.font = '12px var(--font-mono, monospace)';
    ctx.beginPath();
    ctx.arc(A.x, A.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('A', A.x + 8, A.y - 6);

    // Punto B
    ctx.fillStyle = DOMAIN_COLORS.wave;
    ctx.beginPath();
    ctx.arc(B.x, B.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText('B', B.x + 8, B.y - 6);

    // Punto P (arrastrable en la interfaz)
    const pyMin = encontrarMinimoFermat(this.n1, this.n2, this.FERMAT_A, this.FERMAT_B);
    const esMinimo = Math.abs(this.fermatPy - pyMin) < 0.04;
    ctx.fillStyle = esMinimo ? DOMAIN_COLORS.beam : '#efe7d8';
    ctx.shadowColor = esMinimo ? DOMAIN_COLORS.beam : 'transparent';
    ctx.shadowBlur = esMinimo ? 12 : 0;
    ctx.beginPath();
    ctx.arc(P.x, P.y, esMinimo ? 7 : 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = DOMAIN_COLORS.ray;
    ctx.fillText('P', P.x + 8, P.y - 6);
    ctx.restore();
  }

  /** Dibuja el camino A→P→B en modo Fermat */
  private drawFermatPath(): void {
    const ctx = this.ctx;
    const A = this.normToPx(this.FERMAT_A.x, this.FERMAT_A.y);
    const B = this.normToPx(this.FERMAT_B.x, this.FERMAT_B.y);
    const P = this.normToPx(0, this.fermatPy);

    ctx.save();
    ctx.strokeStyle = DOMAIN_COLORS.ray;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.7;

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(P.x, P.y);
    ctx.stroke();

    ctx.strokeStyle = DOMAIN_COLORS.wave;
    ctx.beginPath();
    ctx.moveTo(P.x, P.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
    ctx.restore();
  }

  // ── Cámara oscura (pinhole) ───────────────────────────────────────────────

  /**
   * Dibuja la cámara oscura: objeto flecha a la izquierda, barrera con agujero
   * en el centro y la imagen invertida a la derecha.
   * Geometría por semejanza: yImg = -yObj * (xImg / |xObj|)
   * Agujero grande → imagen más borrosa (mayor blur/alpha en los rayos).
   */
  private drawPinhole(): void {
    const ctx = this.ctx;

    // Parámetros de la escena
    const objX = this.objetoX;           // normalizado, < 0 (izquierda)
    const objH = 0.35;                   // semi-altura del objeto flecha
    const holeH = Math.max(0.015, this.pinholeSize); // semi-altura del agujero
    const wallX = 0;                     // barrera en el centro (norm)
    const imgX = -objX * 0.8;           // imagen en la derecha, simétricamente

    // Geometría por semejanza: yImg_punta = -objH * (imgX / |objX|)
    const ratio = imgX / Math.abs(objX);
    const imgH = objH * ratio;           // semi-altura de la imagen

    // ── Fondo oscuro
    ctx.save();
    ctx.fillStyle = '#0d0c0a';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.restore();

    // ── Eje óptico (tenue)
    ctx.save();
    ctx.strokeStyle = 'rgba(154, 138, 118, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(0, this.CY);
    ctx.lineTo(this.W, this.CY);
    ctx.stroke();
    ctx.restore();

    // ── Barrera vertical con agujero
    const wallPx = this.normToPx(wallX, 0);
    const holeTopPx = this.normToPx(wallX, holeH);
    const holeBotPx = this.normToPx(wallX, -holeH);
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    // Parte superior (encima del agujero)
    ctx.beginPath();
    ctx.moveTo(wallPx.x, 0);
    ctx.lineTo(wallPx.x, holeTopPx.y);
    ctx.stroke();
    // Parte inferior (debajo del agujero)
    ctx.beginPath();
    ctx.moveTo(wallPx.x, holeBotPx.y);
    ctx.lineTo(wallPx.x, this.H);
    ctx.stroke();
    ctx.restore();

    // ── Borde del agujero (destello sutil)
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 167, 44, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wallPx.x - 4, holeTopPx.y);
    ctx.lineTo(wallPx.x + 4, holeTopPx.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wallPx.x - 4, holeBotPx.y);
    ctx.lineTo(wallPx.x + 4, holeBotPx.y);
    ctx.stroke();
    ctx.restore();

    // ── Objeto: flecha vertical a la izquierda
    this.drawArrow(ctx, objX, -objH, objX, objH, DOMAIN_COLORS.ray, 2.5, false);

    // ── Imagen: flecha invertida a la derecha
    // Agujero pequeño = imagen nítida; agujero grande = imagen tenue/difusa
    const imgAlpha = Math.max(0.25, 1 - this.pinholeSize * 4);
    this.drawArrow(ctx, imgX, imgH, imgX, -imgH, DOMAIN_COLORS.wave, 2.0, true, imgAlpha);

    // ── Rayos que pasan por los bordes del agujero (cono de rayos)
    // Dos rayos desde la punta del objeto (arriba) → bordes del agujero → imagen
    const rayAlpha = Math.min(0.65, 0.15 + this.pinholeSize * 1.8);
    const objTopPx  = this.normToPx(objX, objH);
    const objBotPx  = this.normToPx(objX, -objH);
    const imgTopPx  = this.normToPx(imgX, -imgH);  // imagen invertida: top objeto → bot imagen
    const imgBotPx  = this.normToPx(imgX, imgH);

    // Rayo desde punta-objeto por borde-superior del agujero hacia imagen
    this.drawRaySegment(ctx, objTopPx,  holeTopPx, DOMAIN_COLORS.ray,  1.2, rayAlpha);
    this.drawRaySegment(ctx, holeTopPx, imgTopPx,  DOMAIN_COLORS.wave, 1.2, rayAlpha);

    // Rayo desde punta-objeto por borde-inferior del agujero hacia imagen
    this.drawRaySegment(ctx, objTopPx,  holeBotPx, DOMAIN_COLORS.ray,  1.0, rayAlpha * 0.7);
    this.drawRaySegment(ctx, holeBotPx, imgTopPx,  DOMAIN_COLORS.wave, 1.0, rayAlpha * 0.7);

    // Rayo desde cola-objeto por borde-superior del agujero
    this.drawRaySegment(ctx, objBotPx,  holeTopPx, DOMAIN_COLORS.ray,  1.0, rayAlpha * 0.7);
    this.drawRaySegment(ctx, holeTopPx, imgBotPx,  DOMAIN_COLORS.wave, 1.0, rayAlpha * 0.7);

    // Rayo desde cola-objeto por borde-inferior del agujero
    this.drawRaySegment(ctx, objBotPx,  holeBotPx, DOMAIN_COLORS.ray,  1.2, rayAlpha);
    this.drawRaySegment(ctx, holeBotPx, imgBotPx,  DOMAIN_COLORS.wave, 1.2, rayAlpha);

    // ── Etiqueta de tamaño del agujero (tenue)
    ctx.save();
    ctx.fillStyle = 'rgba(239, 231, 216, 0.45)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.fillText(`Ø ${(this.pinholeSize * 200).toFixed(0)}`, wallPx.x, holeBotPx.y + 18);
    ctx.restore();
  }

  /** Dibuja una flecha vertical (objeto o imagen) con punta arriba si goesUp=true */
  private drawArrow(
    ctx: CanvasRenderingContext2D,
    x: number, yBottom: number,
    x2: number, yTop: number,
    color: string, width: number, dashed: boolean, alpha = 1
  ): void {
    const from = this.normToPx(x, yBottom);
    const to   = this.normToPx(x2, yTop);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    if (dashed) ctx.setLineDash([4, 3]);
    ctx.lineCap = 'round';

    // Cuerpo
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Punta de flecha (triángulo en `to`)
    const dy = to.y - from.y;
    const len = Math.abs(dy);
    if (len > 6) {
      const arrowSize = Math.min(10, len * 0.25);
      const dir = dy < 0 ? -1 : 1;  // apunta hacia arriba o abajo según la inversión
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(to.x, to.y);
      ctx.lineTo(to.x - arrowSize * 0.5, to.y + dir * arrowSize);
      ctx.lineTo(to.x + arrowSize * 0.5, to.y + dir * arrowSize);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /** Dibuja un segmento de rayo simple con alpha dado */
  private drawRaySegment(
    ctx: CanvasRenderingContext2D,
    from: { x: number; y: number },
    to: { x: number; y: number },
    color: string,
    width: number,
    alpha: number
  ): void {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  // ── Dispersión (prisma espectral) ─────────────────────────────────────────

  /**
   * Dibuja el banco del prisma con espectro completo.
   * El rayo blanco entra, el prisma lo descompone en N rayos coloreados (400–700 nm).
   * Cada rayo tiene el color CIE real de su λ.
   * Girar thetaInc cambia el ángulo de incidencia sobre la primera cara.
   * En la desviación mínima el espectro es más limpio.
   */
  private drawDispersion(): void {
    const ctx = this.ctx;

    // Fondo oscuro
    ctx.save();
    ctx.fillStyle = '#0d0c0a';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.restore();

    // Eje óptico
    this.drawEjeOptico();

    // Parámetros del prisma (los mismos que en escenaBanco de dispersion.ts)
    const anguloApice = Math.PI / 4;  // 45°
    const material: MaterialOptico = 'BK7';

    // Fuente a la izquierda
    const srcNorm = { x: -0.65, y: 0 };
    const srcPx = this.normToPx(srcNorm.x, srcNorm.y);

    // Dibujar rayo incidente (blanco, antes del prisma)
    const prismaXPx = this.normToPx(0, 0);
    const incAngle = this.thetaInc;  // ángulo de incidencia sobre primera cara
    const yEntrada = srcNorm.y + (0 - srcNorm.x) * Math.tan(incAngle);
    const entradaPx = this.normToPx(0, yEntrada);

    ctx.save();
    ctx.strokeStyle = 'rgba(239,231,216,0.75)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(srcPx.x, srcPx.y);
    ctx.lineTo(entradaPx.x, entradaPx.y);
    ctx.stroke();
    ctx.restore();

    // Dibujar el prisma (triángulo: vértice arriba, dos caras)
    const prismaCX = prismaXPx.x;
    const prismaCY = prismaXPx.y;
    const h = this.CY * 0.5;  // semi-altura del prisma en px
    const base = h * Math.tan(anguloApice / 2);
    ctx.save();
    ctx.strokeStyle = 'rgba(56,189,248,0.45)';
    ctx.fillStyle = 'rgba(56,189,248,0.04)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(prismaCX, prismaCY - h);          // vértice superior
    ctx.lineTo(prismaCX + base, prismaCY + h * 0.5);  // derecha inferior
    ctx.lineTo(prismaCX - base, prismaCY + h * 0.5);  // izquierda inferior
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Muestrear λ de 400 a 700 nm (N rayos)
    const N_RAYOS = 28;
    const lambdas: number[] = [];
    for (let i = 0; i < N_RAYOS; i++) {
      lambdas.push(400 + (300 * i) / (N_RAYOS - 1));
    }

    // Punto de salida extendido
    const xFin = 0.95;

    // Desviación de referencia para λ=550 (para calcular el ángulo de salida en el banco)
    const nRef = nSellmeier(material, 550);
    const DRef = prismaDesviacion(nRef, anguloApice, Math.abs(incAngle));

    lambdas.forEach(lambda => {
      const n = nSellmeier(material, lambda);
      const D = prismaDesviacion(n, anguloApice, Math.abs(incAngle));
      if (isNaN(D)) return;

      // Ángulo de salida del rayo: el rayo sale del prisma desviado D respecto a la incidencia
      // La desviación se aplica al eje original: el rayo sale hacia abajo-derecha más o menos
      const anguloSalida = incAngle >= 0 ? D : -D;

      // Punto de salida del prisma (aproximado en la segunda cara, x=base/2 norm)
      const salidaNormX = base / this.CX;    // fracción del semiancho
      const salidaNormY = yEntrada;           // misma altura de entrada (simplificado)
      const salidaPx = this.normToPx(salidaNormX, salidaNormY);

      // Extender el rayo desde la salida del prisma
      const dxFin = (xFin - salidaNormX) * this.CX;
      const dyFin = dxFin * Math.tan(-anguloSalida);
      const finPx = {
        x: salidaPx.x + dxFin,
        y: salidaPx.y + dyFin,
      };

      // Color CIE del rayo
      const [r, g, b] = wavelengthToSRGB(lambda);
      const color = `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},0.85)`;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 3;
      ctx.beginPath();
      ctx.moveTo(salidaPx.x, salidaPx.y);
      ctx.lineTo(finPx.x, finPx.y);
      ctx.stroke();
      ctx.restore();
    });

    // Marcador de la fuente
    ctx.save();
    ctx.fillStyle = 'rgba(239,231,216,0.9)';
    ctx.shadowColor = 'rgba(239,231,216,0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(srcPx.x, srcPx.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Indicador de desviación mínima (si el ángulo de incidencia está cerca de Dmin)
    if (!isNaN(DRef)) {
      const Dmin = desviacionMinima(nRef, anguloApice);
      const incMin = (Dmin + anguloApice) / 2;  // ángulo de incidencia en Dmin
      if (!isNaN(incMin) && Math.abs(Math.abs(incAngle) - incMin) < 0.05) {
        ctx.save();
        ctx.fillStyle = DOMAIN_COLORS.beam;
        ctx.font = '11px var(--font-mono, monospace)';
        ctx.textAlign = 'center';
        ctx.fillText('δ_min', this.normToPx(0.5, 0.7).x, this.normToPx(0.5, 0.7).y);
        ctx.restore();
      }
    }
  }

  // ── Lentes (formación de imagen) ──────────────────────────────────────────

  /**
   * Dibuja el banco de lentes:
   * - Eje óptico
   * - Objeto flecha (arrastrable en x) a la izquierda
   * - Lente delgada en x=0 (dibujada como elipse biconvexa)
   * - Focos F y F' marcados
   * - Abanico de 5 rayos desde la punta del objeto que refractan
   * - Imagen flecha: real/invertida si s>f, virtual/derecha si s<f
   */
  private drawLentes(): void {
    const ctx = this.ctx;

    // Fondo oscuro
    ctx.save();
    ctx.fillStyle = '#0d0c0a';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.restore();

    this.drawEjeOptico();

    const f = this.lentesF;           // distancia focal norm
    const xObj = this.lentesObjX;     // posición x del objeto (< 0)
    const yObj = 0.28;                // semi-altura del objeto (fija)
    const s = Math.abs(xObj);         // distancia objeto (positiva)

    // Ecuación de Gauss
    const invSp = 1 / f - 1 / s;
    const sPrima = invSp === 0 ? Infinity : 1 / invSp;
    const m = isFinite(sPrima) ? -sPrima / s : 0;

    // Lente: elipse biconvexa centrada en x=0
    const lentePx = this.normToPx(0, 0);
    const lH = this.CY * 0.55;    // semi-alto en px
    const lW = 14;
    ctx.save();
    ctx.strokeStyle = 'rgba(56,189,248,0.7)';
    ctx.fillStyle = 'rgba(56,189,248,0.06)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Cara izquierda (arco convexo)
    ctx.moveTo(lentePx.x, lentePx.y - lH);
    ctx.bezierCurveTo(
      lentePx.x - lW, lentePx.y - lH * 0.5,
      lentePx.x - lW, lentePx.y + lH * 0.5,
      lentePx.x, lentePx.y + lH
    );
    // Cara derecha (arco convexo)
    ctx.bezierCurveTo(
      lentePx.x + lW, lentePx.y + lH * 0.5,
      lentePx.x + lW, lentePx.y - lH * 0.5,
      lentePx.x, lentePx.y - lH
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Marcadores de focos F (objeto) y F' (imagen)
    const fPx  = this.normToPx(-f, 0);
    const fpPx = this.normToPx(f, 0);
    for (const [pos, label] of [[fPx, 'F'], [fpPx, "F'"]] as Array<[{x:number,y:number}, string]>) {
      ctx.save();
      ctx.fillStyle = 'rgba(245,167,44,0.7)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(245,167,44,0.55)';
      ctx.font = '11px var(--font-mono, monospace)';
      ctx.fillText(label, pos.x + 6, pos.y - 6);
      ctx.restore();
    }

    // Objeto: flecha vertical en xObj
    const objPx = this.normToPx(xObj, 0);
    this.drawArrow(ctx, xObj, 0, xObj, yObj, DOMAIN_COLORS.ray, 2.5, false);

    // Guía punteada de 2f
    const f2Px = this.normToPx(-2 * f, 0);
    ctx.save();
    ctx.strokeStyle = 'rgba(245,167,44,0.18)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    ctx.beginPath();
    ctx.moveTo(f2Px.x, 0);
    ctx.lineTo(f2Px.x, this.H);
    ctx.stroke();
    ctx.restore();

    // Abanico de rayos desde la punta del objeto
    // Usar trazarAbanico de imaging.ts para obtener las trayectorias
    const lente = { f };
    const N_RAYOS_FAN = 5;
    const yMax = 0.35;   // apertura máxima del abanico (norm)

    const trayectorias = trazarAbanico(yObj, xObj, lente, N_RAYOS_FAN, yMax, 0.95);

    trayectorias.forEach(tray => {
      if (tray.puntos.length < 2) return;
      ctx.save();
      ctx.strokeStyle = DOMAIN_COLORS.ray;
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      tray.puntos.forEach((pt, i) => {
        const px = this.normToPx(pt.x, pt.y);
        if (i === 0) ctx.moveTo(px.x, px.y);
        else ctx.lineTo(px.x, px.y);
      });
      ctx.stroke();
      ctx.restore();
    });

    // Imagen: flecha en (sPrima, m*yObj) si es real (sPrima > 0)
    if (isFinite(sPrima)) {
      const xImg = sPrima;          // a la derecha de la lente si real
      const yImgTop = m * yObj;     // m < 0 = invertida
      const esReal = sPrima > 0;

      if (esReal && xImg < 1.0) {
        // Imagen real
        this.drawArrow(ctx, xImg, 0, xImg, yImgTop, DOMAIN_COLORS.wave, 2.0, false);
        // Punto de convergencia
        const convergePx = this.normToPx(xImg, yImgTop);
        ctx.save();
        ctx.fillStyle = DOMAIN_COLORS.wave;
        ctx.shadowColor = DOMAIN_COLORS.wave;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(convergePx.x, convergePx.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (!esReal) {
        // Imagen virtual: dibujar en xImg (negativo = mismo lado que objeto)
        const xImgV = sPrima; // negativo
        if (xImgV > -1.0) {
          this.drawArrow(ctx, xImgV, 0, xImgV, yImgTop, DOMAIN_COLORS.wave, 1.5, true);
        }
      }
    }

    // Indicador de objeto en 2f (objetivo del capítulo)
    const en2f = Math.abs(s - 2 * f) < 0.08;
    if (en2f) {
      ctx.save();
      ctx.fillStyle = DOMAIN_COLORS.beam;
      ctx.font = '12px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      ctx.fillText('2f ✓', objPx.x, objPx.y - 20);
      ctx.restore();
    }

    // Marca del objeto (punto base)
    ctx.save();
    ctx.fillStyle = DOMAIN_COLORS.ray;
    ctx.shadowColor = DOMAIN_COLORS.ray;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(objPx.x, objPx.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Aberraciones (abanico multi-altura + mancha) ────────────────────────

  /**
   * Dibuja el banco de aberraciones:
   * - Lente convergente en x=0
   * - Abanico de rayos a distintas alturas (rayos marginales vs paraxiales)
   * - Los rayos NO convergen al mismo punto → mancha de desenfoque (caústica)
   * - Focos paraxial vs marginal marcados con colores distintos
   * - Aberración cromática: rayos de 3 λ (rojo, verde, azul) enfocan en distintos puntos
   * - Slider de apertura (arrastrar verticalmente): cierra el diafragma
   */
  private drawAberraciones(): void {
    const ctx = this.ctx;

    // Fondo oscuro
    ctx.save();
    ctx.fillStyle = '#0d0c0a';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.restore();

    this.drawEjeOptico();

    const f = this.aberracionesF;
    const aperturaActual = Math.max(0.01, this.apertura);
    const yMax = this.aperturaMax * aperturaActual;  // altura máxima de los rayos

    // Lente: elipse biconvexa en x=0
    const lentePx = this.normToPx(0, 0);
    const lH = this.CY * 0.65;
    const lW = 14;
    ctx.save();
    ctx.strokeStyle = 'rgba(56,189,248,0.7)';
    ctx.fillStyle = 'rgba(56,189,248,0.06)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lentePx.x, lentePx.y - lH);
    ctx.bezierCurveTo(lentePx.x - lW, lentePx.y - lH * 0.5, lentePx.x - lW, lentePx.y + lH * 0.5, lentePx.x, lentePx.y + lH);
    ctx.bezierCurveTo(lentePx.x + lW, lentePx.y + lH * 0.5, lentePx.x + lW, lentePx.y - lH * 0.5, lentePx.x, lentePx.y - lH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Diafragma: barras encima y debajo de la apertura
    const yMaxPx = this.normToPx(-0.2, yMax);
    const yMinPx = this.normToPx(-0.2, -yMax);
    const diaX = this.normToPx(-0.20, 0).x;
    ctx.save();
    ctx.strokeStyle = 'rgba(245,167,44,0.7)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'butt';
    // Barra superior
    ctx.beginPath();
    ctx.moveTo(diaX, 0);
    ctx.lineTo(diaX, yMaxPx.y);
    ctx.stroke();
    // Barra inferior
    ctx.beginPath();
    ctx.moveTo(diaX, yMinPx.y);
    ctx.lineTo(diaX, this.H);
    ctx.stroke();
    // Borde del agujero
    ctx.strokeStyle = 'rgba(245,167,44,0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(diaX - 4, yMaxPx.y);
    ctx.lineTo(diaX + 4, yMaxPx.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(diaX - 4, yMinPx.y);
    ctx.lineTo(diaX + 4, yMinPx.y);
    ctx.stroke();
    ctx.restore();

    // Abanico de rayos monocromáticos (múltiples alturas, color amarillo)
    const N_RAYOS = 9;
    const xObjNorm = -0.85;
    const lente = { f };

    // Calcular foco paraxial (thin-lens con objeto muy lejano → s≈∞ → f' ≈ f)
    const focoParaxial = f;   // para objeto en el infinito: f' = f

    // Trazar abanico usando imaging.ts
    const trayectorias = trazarAbanico(0, xObjNorm, lente, N_RAYOS, yMax, 0.90);

    // Calcular foco marginal: intersección de los rayos más externos con el eje
    // El rayo más externo: desde (xObjNorm, 0) a través de yElem=yMax en x=0
    // Ángulo de salida thin-lens: theta_sal = theta_inc - yElem/f
    // Para objeto en el infinito: theta_inc ≈ 0 → theta_sal = -yMax/f
    // El rayo cruza y=0 en x = yMax / (yMax/f) = f
    // Para thin-lens exacto, el foco marginal = f también. Añadimos aberración simulada.
    // Simulamos: el rayo marginal se desvía como una lente "gruesa" → foco en 0.92*f
    const focoMarginal = f * (1 - 0.08 * aperturaActual * aperturaActual);

    // Dibujar rayos con color según altura (amarillo paraxial, naranja marginal)
    trayectorias.forEach((tray, i) => {
      if (tray.puntos.length < 2) return;
      const fractura = Math.abs(i - (N_RAYOS - 1) / 2) / ((N_RAYOS - 1) / 2);
      // fractura=0 → paraxial (azul-blanco), fractura=1 → marginal (naranja)
      const r = Math.round(239 + fractura * 6);
      const g = Math.round(231 - fractura * 110);
      const b = Math.round(216 - fractura * 160);
      const color = `rgba(${r},${g},${b},0.75)`;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      tray.puntos.forEach((pt, j) => {
        const px = this.normToPx(pt.x, pt.y);
        if (j === 0) ctx.moveTo(px.x, px.y);
        else ctx.lineTo(px.x, px.y);
      });
      ctx.stroke();
      ctx.restore();
    });

    // Foco paraxial: marcador azul-blanco
    const fpPx = this.normToPx(focoParaxial, 0);
    ctx.save();
    ctx.strokeStyle = 'rgba(56,189,248,0.9)';
    ctx.fillStyle = 'rgba(56,189,248,0.3)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(fpPx.x, fpPx.y, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = 'rgba(56,189,248,0.7)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.fillText('F (paraxial)', fpPx.x + 8, fpPx.y - 8);
    ctx.restore();

    // Foco marginal: marcador naranja
    const fmPx = this.normToPx(focoMarginal, 0);
    ctx.save();
    ctx.strokeStyle = 'rgba(245,120,44,0.9)';
    ctx.fillStyle = 'rgba(245,120,44,0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(fmPx.x, fmPx.y, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.fillStyle = 'rgba(245,120,44,0.7)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.fillText('F\' (marginal)', fmPx.x + 8, fmPx.y + 16);
    ctx.restore();

    // Mancha de desenfoque en el foco paraxial (círculo de confusión)
    const manchaR = Math.max(1, yMax * this.CX * 0.4 * aperturaActual);
    ctx.save();
    ctx.globalAlpha = 0.25 * aperturaActual;
    const grad = ctx.createRadialGradient(fpPx.x, fpPx.y, 0, fpPx.x, fpPx.y, manchaR);
    grad.addColorStop(0, 'rgba(245,231,180,0.9)');
    grad.addColorStop(1, 'rgba(245,231,180,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(fpPx.x, fpPx.y, manchaR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Aberración cromática: 3 rayos de distinta λ (paralelos al eje)
    const lambdas = [450, 550, 650];
    const n_ref = nSellmeier('BK7', 550);
    lambdas.forEach(lambda => {
      const n = nSellmeier('BK7', lambda);
      // f(lambda) ≈ f_ref * n_ref/n (modelo simplificado de lensmaker)
      const fLambda = f * n_ref / n;
      const focoPx = this.normToPx(fLambda, 0);
      const [r, g, b] = wavelengthToSRGB(lambda);
      const color = `rgba(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)},0.8)`;

      // Rayo paralelo al eje a altura yMax/2
      const yRayo = yMax * 0.5;
      const entradaPx = this.normToPx(-0.20, yRayo);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.normToPx(-0.85, yRayo).x, this.normToPx(-0.85, yRayo).y);
      ctx.lineTo(entradaPx.x, entradaPx.y);
      // Tras la lente: rayo desde (0, yRayo) con ángulo -yRayo/fLambda
      const thetaSal = -yRayo / fLambda;
      const xFin = 0.85;
      const yFin = yRayo + xFin * Math.tan(thetaSal);
      const salidaLentePx = this.normToPx(0, yRayo);
      const finPx = this.normToPx(xFin, yFin);
      ctx.moveTo(salidaLentePx.x, salidaLentePx.y);
      ctx.lineTo(finPx.x, finPx.y);
      ctx.stroke();
      // Marcador de foco cromático
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(focoPx.x, focoPx.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Indicador de apertura cerrada
    if (aperturaActual < 0.3) {
      const pos = this.normToPx(0.3, 0.6);
      ctx.save();
      ctx.fillStyle = DOMAIN_COLORS.beam;
      ctx.font = '12px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      ctx.fillText('diafragma cerrado ✓', pos.x, pos.y);
      ctx.restore();
    }

    // Instrucción de arrastre
    ctx.save();
    ctx.fillStyle = 'rgba(239,231,216,0.35)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.fillText('↕ arrastra para ajustar apertura', this.normToPx(0, -0.85).x, this.normToPx(0, -0.85).y);
    ctx.restore();
  }

  // ── Instrumentos ópticos (dos lentes, afocal) ───────────────────────────

  /**
   * Dibuja el banco de instrumentos:
   * - Dos lentes (objetivo + ocular) sobre el eje
   * - Rayos paralelos entrantes (objeto en el infinito)
   * - La primera lente (objetivo) los hace converger en su foco
   * - El ocular los recoge y los emite paralelos si d = f1+f2
   * - Indicador de configuración afocal
   * - HUD: separación d, f1+f2, aumento angular M
   */
  private drawInstrumentos(): void {
    const ctx = this.ctx;

    // Fondo oscuro
    ctx.save();
    ctx.fillStyle = '#0d0c0a';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.restore();

    this.drawEjeOptico();

    const f1 = this.instrumentosF1;    // focal objetivo
    const f2 = this.instrumentosF2;    // focal ocular
    const d  = this.instrumentosSeparacion;  // separación entre las lentes

    // Posiciones de las lentes en el banco (en coordenadas norm)
    const xL1 = -0.20;    // lente 1 (objetivo) fija
    const xL2 = xL1 + d;  // lente 2 (ocular) móvil

    // Altura de los rayos entrantes (paralelos al eje)
    const yAlturas = [-0.18, -0.09, 0, 0.09, 0.18];

    // Dibujar lente 1 (objetivo)
    this.drawLenteSimbolo(xL1, 'rgba(56,189,248,0.7)', 'rgba(56,189,248,0.06)');
    // Focos de L1
    const fL1Px = this.normToPx(xL1 + f1, 0);
    ctx.save();
    ctx.fillStyle = 'rgba(245,167,44,0.6)';
    ctx.beginPath();
    ctx.arc(fL1Px.x, fL1Px.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(245,167,44,0.5)';
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.fillText('F₁', fL1Px.x + 5, fL1Px.y - 5);
    ctx.restore();

    // Dibujar lente 2 (ocular) — solo si cabe en el canvas
    if (xL2 < 0.88) {
      this.drawLenteSimbolo(xL2, 'rgba(154,138,118,0.7)', 'rgba(154,138,118,0.06)');
      // Focos de L2
      const fL2antPx = this.normToPx(xL2 - f2, 0);
      ctx.save();
      ctx.fillStyle = 'rgba(154,138,118,0.6)';
      ctx.beginPath();
      ctx.arc(fL2antPx.x, fL2antPx.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(154,138,118,0.5)';
      ctx.font = '10px var(--font-mono, monospace)';
      ctx.fillText('F₂', fL2antPx.x + 5, fL2antPx.y - 5);
      ctx.restore();
    }

    // Trazar rayos por las dos lentes
    yAlturas.forEach(y0 => {
      const fractura = Math.abs(y0) / 0.18;
      const alpha = 0.55 + fractura * 0.35;
      const color = `rgba(245,167,44,${alpha.toFixed(2)})`;

      // Segmento 1: entrada → lente 1
      const entPx = this.normToPx(-0.88, y0);
      const enL1Px = this.normToPx(xL1, y0);
      this.drawRaySegment(ctx, entPx, enL1Px, color, 1.3, alpha * 0.8);

      // Tras L1: thin-lens → theta1 = -y0/f1
      const theta1 = -y0 / f1;

      // Punto en lente 2
      const dy_a_L2 = d * Math.tan(theta1);
      const yEnL2 = y0 + dy_a_L2;
      const enL2Px = this.normToPx(xL2, yEnL2);
      this.drawRaySegment(ctx, enL1Px, enL2Px, color, 1.3, alpha * 0.8);

      // Tras L2: thin-lens → theta2 = theta1 - yEnL2/f2
      if (xL2 < 0.88) {
        const theta2 = theta1 - yEnL2 / f2;
        const xFin = 0.88;
        const yFin = yEnL2 + (xFin - xL2) * Math.tan(theta2);
        const finPx = this.normToPx(xFin, yFin);
        // Color del rayo saliente: naranja si no afocal, verde si afocal
        const afocal = Math.abs(d - (f1 + f2)) / (f1 + f2) < 0.05;
        const colorSalida = afocal ? 'rgba(80,220,120,0.85)' : color;
        this.drawRaySegment(ctx, enL2Px, finPx, colorSalida, 1.3, alpha * 0.8);
      }
    });

    // Indicador de afocal
    const afocalActual = Math.abs(d - (f1 + f2)) / (f1 + f2) < 0.05;
    if (afocalActual) {
      const pos = this.normToPx(0.5, 0.65);
      ctx.save();
      ctx.fillStyle = 'rgba(80,220,120,0.9)';
      ctx.shadowColor = 'rgba(80,220,120,0.5)';
      ctx.shadowBlur = 10;
      ctx.font = '13px var(--font-mono, monospace)';
      ctx.textAlign = 'center';
      ctx.fillText('Afocal ✓  d = f₁ + f₂', pos.x, pos.y);
      ctx.restore();
    }

    // Etiqueta de separación d
    const midX = (xL1 + xL2) / 2;
    const dPx1 = this.normToPx(xL1, -0.72);
    const dPx2 = this.normToPx(xL2, -0.72);
    ctx.save();
    ctx.strokeStyle = 'rgba(154,138,118,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(dPx1.x, dPx1.y);
    ctx.lineTo(dPx2.x, dPx2.y);
    ctx.stroke();
    ctx.fillStyle = 'rgba(154,138,118,0.6)';
    ctx.font = '10px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.setLineDash([]);
    ctx.fillText(`d = ${d.toFixed(2)}`, this.normToPx(midX, -0.78).x, this.normToPx(midX, -0.78).y);
    ctx.restore();

    // Instrucción de arrastre
    ctx.save();
    ctx.fillStyle = 'rgba(239,231,216,0.35)';
    ctx.font = '11px var(--font-mono, monospace)';
    ctx.textAlign = 'center';
    ctx.fillText('↔ arrastra para ajustar separación', this.normToPx(0, -0.90).x, this.normToPx(0, -0.90).y);
    ctx.restore();
  }

  /** Dibuja el símbolo de una lente biconvexa centrada en xNorm */
  private drawLenteSimbolo(xNorm: number, stroke: string, fill: string): void {
    const ctx = this.ctx;
    const lentePx = this.normToPx(xNorm, 0);
    const lH = this.CY * 0.55;
    const lW = 12;
    ctx.save();
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lentePx.x, lentePx.y - lH);
    ctx.bezierCurveTo(lentePx.x - lW, lentePx.y - lH * 0.5, lentePx.x - lW, lentePx.y + lH * 0.5, lentePx.x, lentePx.y + lH);
    ctx.bezierCurveTo(lentePx.x + lW, lentePx.y + lH * 0.5, lentePx.x + lW, lentePx.y - lH * 0.5, lentePx.x, lentePx.y - lH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // ── Loop de animación ────────────────────────────────────────────────────

  private loop(): void {
    this.draw();

    // Avanzar el pulso de propagación
    if (this.pulseProgress < 1) {
      this.pulseProgress = Math.min(1, this.pulseProgress + 0.04);
    }

    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  // ── Interacción ──────────────────────────────────────────────────────────

  private bindEvents(): void {
    const canvas = this.canvas;

    // Soporte ratón
    canvas.addEventListener('mousedown', this.onPointerDown.bind(this));
    canvas.addEventListener('mousemove', this.onPointerMove.bind(this));
    canvas.addEventListener('mouseup', this.onPointerUp.bind(this));

    // Soporte táctil
    canvas.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    canvas.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    canvas.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });

    // Redimensionar
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private pointerFromEvent(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private onPointerDown(e: MouseEvent): void {
    const pos = this.pointerFromEvent(e);
    this.dragging = true;

    if (this.pinholeMode) {
      this.dragTarget = 'pinhole-obj';
    } else if (this.lentesMode) {
      this.dragTarget = 'pinhole-obj';   // reuse: moves lentesObjX horizontally
    } else if (this.aberracionesMode) {
      this.dragTarget = 'ray';           // arrastrar Y para cambiar apertura
    } else if (this.instrumentosMode) {
      this.dragTarget = 'ray';           // arrastrar X para cambiar separación
    } else if (this.fermatMode) {
      this.dragTarget = 'fermat';
    } else {
      this.dragTarget = 'ray';
    }
    this.handleDrag(pos);
  }

  private onPointerMove(e: MouseEvent): void {
    if (!this.dragging) return;
    this.handleDrag(this.pointerFromEvent(e));
  }

  private onPointerUp(_e: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      this.dragTarget = null;
      this.triggerPulse();
    }
  }

  private onTouchStart(e: TouchEvent): void {
    const t = e.touches[0];
    if (!t) return;
    const rect = this.canvas.getBoundingClientRect();
    this.dragging = true;
    this.dragTarget = (this.pinholeMode || this.lentesMode) ? 'pinhole-obj' : this.fermatMode ? 'fermat' : 'ray';
    this.handleDrag({ x: t.clientX - rect.left, y: t.clientY - rect.top });
  }

  private onTouchMove(e: TouchEvent): void {
    const t = e.touches[0];
    if (!t || !this.dragging) return;
    const rect = this.canvas.getBoundingClientRect();
    this.handleDrag({ x: t.clientX - rect.left, y: t.clientY - rect.top });
  }

  private onTouchEnd(_e: TouchEvent): void {
    if (this.dragging) {
      this.dragging = false;
      this.dragTarget = null;
      this.triggerPulse();
    }
  }

  private handleDrag(px: { x: number; y: number }): void {
    const norm = this.pxToNorm(px.x, px.y);

    if (this.dragTarget === 'ray') {
      if (this.aberracionesMode) {
        // Arrastrar verticalmente para cambiar la apertura (0..1)
        // norm.y va de -1 (abajo) a 1 (arriba): mapear a apertura 0..1
        const ap = Math.max(0.02, Math.min(1.0, (norm.y + 1) / 2));
        this.apertura = ap;
        if (this.config.onAperturaChange) this.config.onAperturaChange(ap);
        return;
      }
      if (this.instrumentosMode) {
        // Arrastrar horizontalmente para cambiar la separación
        // norm.x en [-1,1]: mapear a separación 0.05..0.90
        const sep = Math.max(0.05, Math.min(0.90, norm.x + 0.8));
        this.instrumentosSeparacion = sep;
        if (this.config.onSeparacionChange) this.config.onSeparacionChange(sep);
        return;
      }
      // El ángulo se calcula desde la fuente al puntero del ratón
      const srcPx = this.normToPx(this.SOURCE_X_NORM, this.SOURCE_Y_NORM);
      const dx = px.x - srcPx.x;
      const dy = srcPx.y - px.y;  // y crece hacia abajo en canvas
      if (dx > 0) {
        const theta = Math.atan2(dy, dx);
        // Limitar a ±80°
        const thetaLimitado = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, theta));
        this.thetaInc = thetaLimitado;
        this.config.onAngleChange(thetaLimitado);
      }
    } else if (this.dragTarget === 'fermat') {
      // P solo se mueve a lo largo de la interfaz (x=0), py varía
      const pyClamp = Math.max(-0.9, Math.min(0.9, norm.y));
      this.fermatPy = pyClamp;
      this.config.onFermatPChange(pyClamp);
    } else if (this.dragTarget === 'pinhole-obj') {
      // Mover el objeto flecha en x: solo la componente x, limitada al lado izquierdo
      const xClamp = Math.max(-0.9, Math.min(-0.1, norm.x));
      if (this.lentesMode) {
        // En modo lentes movemos la posición x del objeto
        this.lentesObjX = xClamp;
        if (this.config.onLentesObjChange) {
          this.config.onLentesObjChange(xClamp);
        }
      } else {
        this.objetoX = xClamp;
        // Notificar al exterior que el objeto se movió (reusamos onFermatPChange para transportar objetoX)
        this.config.onFermatPChange(xClamp);
      }
    }
  }

  private onResize(): void {
    this.resize();
  }

  /** Retorna el estado actual de lentes para el HUD */
  getLentesState(): { s: number; sPrima: number; m: number; f: number } {
    const f = this.lentesF;
    const s = Math.abs(this.lentesObjX);
    const invSp = 1 / f - 1 / s;
    const sPrima = invSp === 0 ? Infinity : 1 / invSp;
    const m = isFinite(sPrima) ? -sPrima / s : 0;
    return { s, sPrima, m, f };
  }

  /** Retorna la desviación del prisma para el HUD (en grados) y λ dominante */
  getDispersionState(): { desviacionDeg: number; lambdaDominante: number } {
    const anguloApice = Math.PI / 4;
    const material: MaterialOptico = 'BK7';
    const nRef = nSellmeier(material, 550);
    const D = prismaDesviacion(nRef, anguloApice, Math.abs(this.thetaInc));
    const desviacionDeg = isNaN(D) ? 0 : (D * 180) / Math.PI;
    // λ dominante: usamos 550 nm (verde) como referencia; en la desviación mínima más limpio
    return { desviacionDeg, lambdaDominante: 550 };
  }

  /** Retorna el estado del banco de aberraciones para el HUD */
  getAberracionesState(): { lsa: number; lca: number; apertura: number } {
    const f = this.aberracionesF;
    const yMax = this.aperturaMax * this.apertura;
    const lente = { f };
    // LSA: aberración esférica longitudinal
    const resEsf = aberracionEsferica(lente, 10.0, Math.max(0.001, yMax), 7);
    const lsa = resEsf.longitudinal;
    // LCA: diferencia de foco azul (450 nm) vs rojo (650 nm)
    // Usamos BK7 con ecuación de fabricante simplificada: f(n) = f_ref * n_ref / n
    const n_ref = nSellmeier('BK7', 550);
    const resCrom = aberracionCromatica(
      (n: number) => f * n_ref / n,
      'BK7',
      10.0,
      [450, 650]
    );
    const lca = resCrom.length >= 2
      ? (resCrom[0]!.foco - resCrom[1]!.foco)
      : 0;
    return { lsa, lca, apertura: this.apertura };
  }

  /** Retorna el estado del banco de instrumentos para el HUD */
  getInstrumentosState(): { separacion: number; afocal: number; aumento: number } {
    const afocal = this.instrumentosF1 + this.instrumentosF2;
    const aumento = -(this.instrumentosF1 / this.instrumentosF2);
    return { separacion: this.instrumentosSeparacion, afocal, aumento };
  }

  /** Limpia recursos */
  destroy(): void {
    if (this.animFrame !== null) {
      cancelAnimationFrame(this.animFrame);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}

