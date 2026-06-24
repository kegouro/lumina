// English dictionary
import type { es } from './es';

// Tipo derivado para garantizar que EN tiene todas las claves de ES
export const en: Record<keyof typeof es, string> = {
  // General
  'app.title': 'Lumina',
  'app.subtitle': 'optics course-lab',

  // Start menu
  'menu.historia': 'Story',
  'menu.laboratorio': 'Lab',
  'menu.continuar': 'Continue',
  'menu.ruta.pedagogica': 'Pedagogical route',
  'menu.ruta.historica': 'Historical route',
  'menu.lab.proximamente': 'Coming soon',

  // Language
  'lang.es': 'Español',
  'lang.en': 'English',

  // HUD
  'hud.matriz': 'ABCD Matrix',
  'hud.haz': 'Beam parameters',
  'hud.elemento': 'Selected element',
  'hud.n1': 'n₁',
  'hud.n2': 'n₂',
  'hud.theta1': 'θ₁',
  'hud.theta2': 'θ₂',
  'hud.tir': 'Total internal reflection',
  'hud.plegar': 'Collapse',
  'hud.desplegar': 'Expand',

  // Physics
  'fisica.rayo': 'Ray',
  'fisica.lente': 'Thin lens',
  'fisica.espejo': 'Mirror',
  'fisica.interfaz': 'Interface',
  'fisica.focal': 'Focal length',
  'fisica.cintura': 'Beam waist',
  'fisica.paraxial.aviso': 'We have left the paraxial regime; the matrix model loses validity.',

  // Refraction — cinematic scene
  'refraccion.frase': 'Light enters water… and bends.',
  'refraccion.titulo': 'Refraction',
  'refraccion.intuicion': 'Light changes speed as it crosses the interface. The more abrupt the index change, the more the ray bends.',
  'refraccion.deduccion.titulo': "Snell's Law",
  'refraccion.deduccion.texto': 'n₁ sin θ₁ = n₂ sin θ₂',
  'refraccion.deduccion.derivacion': "Fermat's principle demands that travel time be stationary. Equating the time derivatives with respect to the crossing point yields n₁ sin θ₁ = n₂ sin θ₂.",
  'refraccion.deduccion.ver': 'Show derivation',
  'refraccion.deduccion.ocultar': 'Hide derivation',
  'refraccion.comenzar': 'Explore the bench',

  // Fermat
  'fermat.titulo': "Fermat's Challenge",
  'fermat.instruccion': 'Drag point P on the interface to minimize travel time.',
  'fermat.tiempo': 'Optical path',
  'fermat.minimo': "Minimum time! — this is Snell's law",
  'fermat.unidades': 'a.u.',

  // Optical bench
  'bench.n1.label': 'Medium 1 (n₁)',
  'bench.n2.label': 'Medium 2 (n₂)',
  'bench.arrastrar': 'Drag the ray to change the angle of incidence',
  'bench.tir.aviso': 'Total internal reflection — the ray does not cross the interface',

  // Unlock
  'desbloqueo.interfaz': 'Tool unlocked: Interface/Medium!',
  'desbloqueo.descripcion': 'You can now add interfaces with different indices in the free lab.',

  // Progress map
  'mapa.titulo': 'Act I — Light as a Ray',
  'mapa.nodo.bloqueado': 'Locked',
  'mapa.nodo.disponible': 'Available',
  'mapa.nodo.completado': 'Completed',
  'mapa.nodo.proximamente': 'Coming soon',
  'mapa.nodo.prereqs': 'Requires completing first:',
  'mapa.volver': 'Back to menu',
  'mapa.ruta.pedagogica': 'Pedagogical route',
  'mapa.ruta.historica': 'Historical route',

  // Ray — cinematic scene
  'rayo.frase': 'Before all optics: a hole, an arrow, and the dark.',
  'rayo.titulo': 'The Ray of Light',
  'rayo.intuicion': 'Light travels in straight lines. A pinhole camera proves it: each point on the object sends rays in every direction; only those passing through the hole reach the wall, drawing an inverted image.',
  'rayo.deduccion.titulo': 'Rectilinear propagation',
  'rayo.deduccion.texto': 'Inverted image = straight paths + aperture selection',
  'rayo.deduccion.derivacion': 'Rays from the top of the arrow that pass through the hole arrive at the bottom of the image, and vice versa. The inversion is a direct consequence of rectilinear geometry.',
  'rayo.deduccion.ver': 'See why it inverts',
  'rayo.deduccion.ocultar': 'Hide derivation',
  'rayo.comenzar': 'Open the pinhole camera',

  // Reflection — cinematic scene
  'reflexion.frase': "The mirror doesn't lie — it gives back exactly what it receives.",
  'reflexion.titulo': 'Reflection',
  'reflexion.intuicion': 'The angle of incidence equals the angle of reflection. The flat mirror preserves the angle because the normal component of the ray reverses sign while the tangential component is preserved.',
  'reflexion.deduccion.titulo': 'Law of reflection',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': 'The normal to the mirror is the axis of symmetry: the incident and reflected rays form equal angles with it. This is equivalent to reversing only the component perpendicular to the mirror.',
  'reflexion.deduccion.ver': 'Show derivation',
  'reflexion.deduccion.ocultar': 'Hide derivation',
  'reflexion.comenzar': 'Explore the mirror',

  // Fermat — cinematic scene (full chapter)
  'fermat.frase': 'Nature is lazy. It always takes the path that costs the least time.',
  'fermat.titulo.escena': "Fermat's Principle",
  'fermat.intuicion': 'Reflection and refraction are not independent laws. They are consequences of the same principle: light takes the path of stationary time. Move the bounce point and watch the time minimize exactly when θᵢ = θᵣ.',
  'fermat.deduccion.titulo': 'Stationary time',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflection)  |  n₁ sin θ₁ = n₂ sin θ₂  (refraction)',
  'fermat.deduccion.derivacion': "Differentiate travel time with respect to the reflection point P and set to zero. The condition δt/δP = 0 implies equal angles in reflection and Snell's law in refraction.",
  'fermat.deduccion.ver': 'Show the principle',
  'fermat.deduccion.ocultar': 'Hide derivation',
  'fermat.comenzar': 'Explore the minimum',

  // Optical bench — ray/pinhole
  'bench.pinhole.instruccion': 'Observe how the image inverts as it passes through the hole',
  'bench.pinhole.completar': 'Inverted projection observed! Light travels in straight lines.',

  // Optical bench — reflection
  'bench.reflexion.instruccion': 'Drag the ray to change the angle of incidence',
  'bench.reflexion.blanco': 'Bounce the ray toward the target',
  'bench.reflexion.exito': 'Hit! θᵢ = θᵣ — the law of reflection in action.',

  // Fermat reflection
  'fermat.reflexion.titulo': 'Fermat at the Mirror',
  'fermat.reflexion.instruccion': 'Drag point P along the mirror to minimize travel time.',
  'fermat.reflexion.minimo': 'Minimum time! — θᵢ = θᵣ holds here.',

  // Additional unlocks
  'desbloqueo.fuente': 'Tool unlocked: Light source!',
  'desbloqueo.fuente.descripcion': 'You can now add light sources in the free lab.',
  'desbloqueo.espejo-plano': 'Tool unlocked: Flat mirror!',
  'desbloqueo.espejo-plano.descripcion': 'You can now add flat mirrors in the free lab.',

  // Dispersion — cinematic scene
  'dispersion.frase': 'White is not a colour. It is all colours at once.',
  'dispersion.titulo': 'Dispersion and colour',
  'dispersion.intuicion': 'The refractive index depends on wavelength. The prism does not create colours — it separates them. Colour is not in the light: it is in you, in the cones of your retina that interpret each frequency.',
  'dispersion.deduccion.titulo': 'Sellmeier equation',
  'dispersion.deduccion.texto': 'n²(λ) = 1 + Σ Bᵢλ² / (λ² − Cᵢ)',
  'dispersion.deduccion.derivacion': 'Bound electrons in glass have resonance frequencies. Near each resonance the index rises sharply (anomalous dispersion). Far from them n decreases with λ (normal dispersion). The Abbe number V = (nD−1)/(nF−nC) measures how much a material disperses.',
  'dispersion.deduccion.ver': 'Show the equation',
  'dispersion.deduccion.ocultar': 'Hide derivation',
  'dispersion.comenzar': 'Open the prism',

  // Dispersion — bench
  'dispersion.bench.instruccion': 'Drag the prism (or adjust incidence) to explore the spectrum',
  'dispersion.bench.desviacion': 'Deviation',
  'dispersion.bench.lambda': 'Dominant λ',
  'dispersion.bench.minimo': 'Minimum deviation! The spectrum is cleanest here.',
  'dispersion.bench.completar': 'Spectrum separated! White light reveals its colours.',
  'dispersion.objetivo.instruccion': 'Rotate the prism until you reach minimum deviation',

  // Dispersion unlock
  'desbloqueo.espectrometro': 'Tool unlocked: Spectrometer!',
  'desbloqueo.espectrometro.descripcion': 'You can now analyse source spectra in the free lab.',

  // Lenses — cinematic scene
  'lentes.frase': 'A lens does not bend light — it summons it to a point.',
  'lentes.titulo': 'Lenses and curved mirrors',
  'lentes.intuicion': 'A thin lens applies Snell at two surfaces. The paraxial result is elegant: all rays from one object point converge at one image point. The Gaussian lens equation links object, image and focal length.',
  'lentes.deduccion.titulo': "Gaussian lens equation",
  'lentes.deduccion.texto': '1/s + 1/s′ = 1/f   |   m = −s′/s',
  'lentes.deduccion.derivacion': 'For s > f the image is real and inverted (m < 0). For s < f the image is virtual and upright (m > 0). At s = 2f the magnification is −1: the image is the same size and also at 2f. The geometric construction uses three principal rays: parallel to axis → through image focus; through optical centre → undeviated; through object focus → parallel to axis.',
  'lentes.deduccion.ver': 'Show derivation',
  'lentes.deduccion.ocultar': 'Hide derivation',
  'lentes.comenzar': 'Explore the lens',

  // Lenses — bench
  'lentes.bench.instruccion': 'Drag the object to change distance s',
  'lentes.bench.s': 's (object)',
  'lentes.bench.sPrima': "s′ (image)",
  'lentes.bench.m': 'm (magnification)',
  'lentes.bench.f': 'f (focal)',
  'lentes.bench.real': 'real',
  'lentes.bench.virtual': 'virtual',
  'lentes.bench.objetivo': 'Place the object at 2f to achieve m = −1',
  'lentes.bench.completar': 'Sharp image at 2f! Magnification exactly −1.',

  // Lenses unlock
  'desbloqueo.lente': 'Tool unlocked: Thin lens!',
  'desbloqueo.lente.descripcion': 'You can now add converging and diverging lenses in the free lab.',
};
