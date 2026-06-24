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
  'refraccion.intuicion': 'Imagine soldiers marching in formation toward mud: the row that hits the mud first slows down, and the whole formation pivots. Light does the same when it crosses between two media — it changes speed and changes direction. The greater the index jump, the sharper the bend. Snell captured that in a single equation.',
  'refraccion.deduccion.titulo': "Snell's Law",
  'refraccion.deduccion.texto': 'n₁ sin θ₁ = n₂ sin θ₂',
  'refraccion.deduccion.derivacion': "Fermat's principle demands that travel time be stationary. Equating the time derivatives with respect to the crossing point yields n₁ sin θ₁ = n₂ sin θ₂. The index n = c/v measures how much the medium slows light: larger n means slower speed and sharper bending.",
  'refraccion.deduccion.ver': 'Show derivation',
  'refraccion.deduccion.ocultar': 'Hide derivation',
  'refraccion.comenzar': 'Explore the bench',
  'refraccion.guia.objetivo': 'Drag point P along the interface and watch the total optical path change. Find the minimum: that is where θ₁ and θ₂ satisfy the exact Snell equation.',
  'refraccion.guia.pista': 'Move P up and down. The optical path (shown in the panel) goes down, reaches a minimum, then climbs back up. The minimum is where the light actually passes.',

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
  'rayo.intuicion': "Light doesn't turn corners — it travels straight and stubborn until it hits something. That is why a single pinhole is enough to draw the world upside down. Every point on the arrow fires a straight ray through the hole and lands on the opposite side: top becomes bottom. Aristotle already saw it in the dappled shadows under trees.",
  'rayo.deduccion.titulo': 'Rectilinear propagation',
  'rayo.deduccion.texto': 'Inverted image = straight paths + aperture selection',
  'rayo.deduccion.derivacion': 'Rays from the top of the arrow that pass through the hole arrive at the bottom of the image, and vice versa. The inversion is a direct consequence of rectilinear geometry. Enlarge the hole: more rays enter, the image dissolves. Shrink it: the image sharpens but dims. The blur is not a flaw of the hole — it is pure geometry.',
  'rayo.deduccion.ver': 'See why it inverts',
  'rayo.deduccion.ocultar': 'Hide derivation',
  'rayo.comenzar': 'Open the pinhole camera',
  'rayo.guia.objetivo': 'Grab the amber arrow and slide it along the bench — move it closer to the hole, then further away. Watch its twin on the other side flip upside down. When you understand why it inverts, press «I see it inverted».',
  'rayo.guia.pista': 'Drag the tip of the arrow along the axis and watch what happens to the image as you approach the hole. The image grows because the rays diverge more.',

  // Reflection — cinematic scene
  'reflexion.frase': "The mirror doesn't lie — it gives back exactly what it receives.",
  'reflexion.titulo': 'Reflection',
  'reflexion.intuicion': "A mirror invents nothing: it returns each ray at the same angle it arrived, like a ball bouncing off a perfect wall. Hero of Alexandria sensed this two thousand years ago — and added something beautiful: light always chooses the shortest path. At its core, a mirror is a principle of economy.",
  'reflexion.deduccion.titulo': 'Law of reflection',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': "The normal to the mirror is the axis of symmetry: the incident and reflected rays form equal angles with it. This is equivalent to reversing only the component perpendicular to the mirror. Hero proved that this path is the minimum: any other reflection point would make the journey longer.",
  'reflexion.deduccion.ver': 'Show derivation',
  'reflexion.deduccion.ocultar': 'Hide derivation',
  'reflexion.comenzar': 'Explore the mirror',
  'reflexion.guia.objetivo': 'Rotate the ray by dragging it until, after bouncing off the mirror, it hits the target dead-on. Watch the HUD: the incoming angle and the outgoing angle are twins.',
  'reflexion.guia.pista': 'Drag the end of the ray up or down. The target sits on the optical axis (centre). When θᵢ = θᵣ the reflected ray points straight at it.',

  // Fermat — cinematic scene (full chapter)
  'fermat.frase': 'Nature is lazy. It always takes the path that costs the least time.',
  'fermat.titulo.escena': "Fermat's Principle",
  'fermat.intuicion': "Reflection and refraction are not independent laws — they are two faces of the same principle. Light acts like a courier who always picks the fastest route between two points. Move the bounce point along the mirror and you will see the optical path narrow toward a precise minimum — exactly where θᵢ = θᵣ. The law of reflection is not an axiom: it is a consequence.",
  'fermat.deduccion.titulo': 'Stationary time',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflection)  |  n₁ sin θ₁ = n₂ sin θ₂  (refraction)',
  'fermat.deduccion.derivacion': "Differentiate travel time with respect to the reflection point P and set to zero. The condition δt/δP = 0 implies equal angles in reflection and Snell's law in refraction. The 'minimum' is technically a stationary point: it can be a minimum, maximum, or saddle depending on geometry. Fermat called it 'least time'; the modern form says 'stationary time'.",
  'fermat.deduccion.ver': 'Show the principle',
  'fermat.deduccion.ocultar': 'Hide derivation',
  'fermat.comenzar': 'Explore the minimum',
  'fermat.guia.objetivo': 'Drag the bounce point P along the mirror. The bottom panel shows the total optical path A→P→B. Find the minimum: that is where light actually reflects, and there θᵢ = θᵣ.',
  'fermat.guia.pista': 'Move P left and right. The optical path traces a parabola — the minimum is at the bottom. When the path bar stops falling and starts rising, you have found the Fermat point.',

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
  'dispersion.intuicion': "White is not a colour — it is all of them travelling together. Glass slows each one differently: violet more than red. When they exit the prism they fan out. Newton understood this with a prism and a darkened room. And notice: the colour is not in the light — it is in you, in the cones of your retina that interpret each frequency.",
  'dispersion.deduccion.titulo': 'Sellmeier equation',
  'dispersion.deduccion.texto': 'n²(λ) = 1 + Σ Bᵢλ² / (λ² − Cᵢ)',
  'dispersion.deduccion.derivacion': 'Bound electrons in glass have resonance frequencies. Near each resonance the index rises sharply (anomalous dispersion). Far from them n decreases with λ (normal dispersion). The Abbe number V = (nD−1)/(nF−nC) measures how much a material disperses. The BK7 glass in this bench has V ≈ 64: low dispersion — good for precision optics.',
  'dispersion.deduccion.ver': 'Show the equation',
  'dispersion.deduccion.ocultar': 'Hide derivation',
  'dispersion.comenzar': 'Open the prism',
  'dispersion.guia.objetivo': 'Rotate the prism by dragging the incident ray. Find the angle where the colour spectrum opens cleanest — minimum deviation. When you find it, press the button to confirm.',
  'dispersion.guia.pista': 'Drag the ray toward smaller angles of incidence. You will see the spectrum deviation first decrease then increase. The minimum is where light passes symmetrically through the prism.',

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
  'lentes.intuicion': 'A lens is a curved prism: each zone bends the light a little more than the one before it, and all those bends meet at the same point. The paraxial result is elegant — almost magical: no matter which height of the object the ray comes from, it arrives at the same image point. The Gaussian lens equation captures that elegance in three terms.',
  'lentes.deduccion.titulo': "Gaussian lens equation",
  'lentes.deduccion.texto': '1/s + 1/s′ = 1/f   |   m = −s′/s',
  'lentes.deduccion.derivacion': 'For s > f the image is real and inverted (m < 0). For s < f the image is virtual and upright (m > 0). At s = 2f the magnification is −1: the image is the same size and also at 2f — object and image swap roles, a beautiful symmetry. The geometric construction uses three principal rays: parallel to axis → through image focus; through optical centre → undeviated; through object focus → parallel to axis.',
  'lentes.deduccion.ver': 'Show derivation',
  'lentes.deduccion.ocultar': 'Hide derivation',
  'lentes.comenzar': 'Explore the lens',
  'lentes.guia.objetivo': 'Drag the object (amber arrow) to the right until it sits at 2f — the dotted guide line marks where 2f is. When magnification m ≈ −1, the real inverted image is the same size as the object.',
  'lentes.guia.pista': 'Find the vertical dotted line to the left of the lens: that is the 2f position. Place the base of the arrow right on that line. The HUD will show m = −1.00 when you nail it.',

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

  // Aberrations — cinematic scene
  'aberraciones.frase': 'The perfect lens does not exist. The real world blurs.',
  'aberraciones.titulo': 'Aberrations',
  'aberraciones.intuicion': 'The perfect lens lives only in textbooks. In reality, rays grazing the edge of a lens bend a little more than those through the centre, and each colour focuses at a different spot. The result: a blurry patch where there should be a point. The oldest fix is also the most elegant — close the aperture stop and let only the well-behaved rays through.',
  'aberraciones.deduccion.titulo': 'Spherical and chromatic aberration',
  'aberraciones.deduccion.texto': 'LSA = f_marginal − f_paraxial  |  LCA = f_blue − f_red',
  'aberraciones.deduccion.derivacion': 'Longitudinal spherical aberration (LSA) measures how far the marginal focus shifts from the paraxial one. For a simple lens it vanishes only with an infinitely small aperture. Longitudinal chromatic aberration (LCA) arises from n(λ): blue (small λ, larger n) focuses closer. Achromatic doublets equalise f_blue ≈ f_red by combining two materials with different Abbe numbers — the solution used by every quality telescope.',
  'aberraciones.deduccion.ver': 'Show aberration',
  'aberraciones.deduccion.ocultar': 'Hide derivation',
  'aberraciones.comenzar': 'Explore the bench',
  'aberraciones.guia.objetivo': 'Drag the aperture edge inward to close it below 25 %. Watch the aberration blur spot shrink. Smaller aperture means sharper focus — but also less light.',
  'aberraciones.guia.pista': 'Drag the bright upper aperture line downward. The HUD shows LSA in real time: when it drops near zero, spherical aberration is under control.',

  // Aberrations — bench
  'aberraciones.bench.instruccion': 'Drag to adjust the aperture stop',
  'aberraciones.bench.apertura': 'Aperture',
  'aberraciones.bench.lsa': 'LSA (spherical)',
  'aberraciones.bench.lca': 'LCA (chromatic)',
  'aberraciones.bench.objetivo': 'Close the aperture to reduce spherical aberration',
  'aberraciones.bench.completar': 'Aberration minimised! The aperture stop is the solution.',
  'aberraciones.bench.focoParaxial': 'Paraxial focus',
  'aberraciones.bench.focoMarginal': 'Marginal focus',

  // Aberrations unlock
  'desbloqueo.diafragma': 'Tool unlocked: Aperture stop!',
  'desbloqueo.diafragma.descripcion': 'You can now add aperture stops to control the aperture in the free lab.',

  // Optical instruments — cinematic scene
  'instrumentos.frase': 'Two lenses and infinity fits in your eye.',
  'instrumentos.titulo': 'Optical instruments',
  'instrumentos.intuicion': "Galileo pointed two lenses at the sky and saw the moons of Jupiter. The secret: the first lens forms a tiny image of the distant object; the second uses it as a magnifier. When their separation is exactly f₁ + f₂ — the afocal setup — rays emerge parallel and the eye does not strain. Getting that separation right is the difference between blur and seeing the moons.",
  'instrumentos.deduccion.titulo': 'Angular magnification of the telescope',
  'instrumentos.deduccion.texto': 'M = −f₁/f₂   (afocal: d = f₁ + f₂)',
  'instrumentos.deduccion.derivacion': 'The objective forms the image of the distant object at its rear focal plane (x = f₁). The eyepiece is placed at distance f₂ from that image. With d = f₁ + f₂ the final image is at infinity: rays emerge parallel. The exit angle is M times the entrance angle (M negative = inverted image). The magnifying glass amplifies with a single lens (M ≈ 25/f cm); the microscope uses two lenses with a real intermediate image between them.',
  'instrumentos.deduccion.ver': 'Show the telescope',
  'instrumentos.deduccion.ocultar': 'Hide derivation',
  'instrumentos.comenzar': 'Build the telescope',
  'instrumentos.guia.objetivo': 'Drag the second lens (eyepiece) to adjust the separation d between the two lenses. When d ≈ f₁ + f₂, rays emerge parallel and the HUD will show «Afocal ✓». That is the telescope.',
  'instrumentos.guia.pista': 'The HUD shows the current separation d and the target value f₁+f₂. Move the second lens closer to the first until the two values match. The rays on the right side will become parallel.',

  // Instruments — bench
  'instrumentos.bench.instruccion': 'Drag to adjust the separation between lenses',
  'instrumentos.bench.separacion': 'Separation d',
  'instrumentos.bench.f1f2': 'f₁ + f₂',
  'instrumentos.bench.aumento': 'Angular magnification M',
  'instrumentos.bench.objetivo.instruccion': 'Adjust the separation until d ≈ f₁ + f₂ (afocal setup)',
  'instrumentos.bench.completar': 'Afocal telescope! Rays emerge parallel.',
  'instrumentos.bench.afocal': 'Afocal ✓',

  // Instruments unlock
  'desbloqueo.sistema-multi-elemento': 'Tool unlocked: Multi-element system!',
  'desbloqueo.sistema-multi-elemento.descripcion': 'You can now combine multiple lenses and mirrors in the free lab.',
};
