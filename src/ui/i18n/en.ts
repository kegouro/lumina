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
};
