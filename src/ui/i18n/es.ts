// Diccionario español (idioma por defecto)
export const es = {
  // Interfaz general
  'app.title': 'Lumina',
  'app.subtitle': 'curso-laboratorio de óptica',

  // Menú de inicio
  'menu.historia': 'Historia',
  'menu.laboratorio': 'Laboratorio',
  'menu.continuar': 'Continuar',
  'menu.ruta.pedagogica': 'Ruta pedagógica',
  'menu.ruta.historica': 'Ruta histórica',
  'menu.lab.proximamente': 'Próximamente',

  // Idioma
  'lang.es': 'Español',
  'lang.en': 'English',

  // HUD
  'hud.matriz': 'Matriz ABCD',
  'hud.haz': 'Parámetros del haz',
  'hud.elemento': 'Elemento seleccionado',
  'hud.n1': 'n₁',
  'hud.n2': 'n₂',
  'hud.theta1': 'θ₁',
  'hud.theta2': 'θ₂',
  'hud.tir': 'Reflexión total interna',
  'hud.plegar': 'Plegar',
  'hud.desplegar': 'Desplegar',

  // Física
  'fisica.rayo': 'Rayo',
  'fisica.lente': 'Lente delgada',
  'fisica.espejo': 'Espejo',
  'fisica.interfaz': 'Interfaz',
  'fisica.focal': 'Distancia focal',
  'fisica.cintura': 'Cintura del haz',
  'fisica.paraxial.aviso': 'Salimos del reino paraxial; el modelo matricial pierde validez.',

  // Refracción — escena cinematográfica
  'refraccion.frase': 'La luz entra al agua… y se dobla.',
  'refraccion.titulo': 'Refracción',
  'refraccion.intuicion': 'La luz cambia de velocidad al cruzar la interfaz. Cuanto más brusco el cambio de índice, más se dobla el rayo.',
  'refraccion.deduccion.titulo': 'Ley de Snell',
  'refraccion.deduccion.texto': 'n₁ sin θ₁ = n₂ sin θ₂',
  'refraccion.deduccion.derivacion': 'El principio de Fermat exige que el tiempo de viaje sea estacionario. Igualar las derivadas del tiempo respecto al punto de cruce conduce a n₁ sin θ₁ = n₂ sin θ₂.',
  'refraccion.deduccion.ver': 'Ver deducción',
  'refraccion.deduccion.ocultar': 'Ocultar deducción',
  'refraccion.comenzar': 'Explorar el banco',

  // Fermat
  'fermat.titulo': 'Desafío de Fermat',
  'fermat.instruccion': 'Arrastra el punto P sobre la interfaz para minimizar el tiempo de viaje.',
  'fermat.tiempo': 'Camino óptico',
  'fermat.minimo': '¡Tiempo mínimo! — esto es la ley de Snell',
  'fermat.unidades': 'u.a.',

  // Banco óptico
  'bench.n1.label': 'Medio 1 (n₁)',
  'bench.n2.label': 'Medio 2 (n₂)',
  'bench.arrastrar': 'Arrastra el rayo para cambiar el ángulo de incidencia',
  'bench.tir.aviso': 'Reflexión total interna — el rayo no cruza la interfaz',

  // Desbloqueo
  'desbloqueo.interfaz': '¡Herramienta desbloqueada: Interfaz/Medio!',
  'desbloqueo.descripcion': 'Ahora puedes añadir interfaces con distintos índices en el banco libre.',

  // Mapa de progresión
  'mapa.titulo': 'Acto I — La luz como rayo',
  'mapa.nodo.bloqueado': 'Bloqueado',
  'mapa.nodo.disponible': 'Disponible',
  'mapa.nodo.completado': 'Completado',
  'mapa.nodo.proximamente': 'Próximamente',
  'mapa.nodo.prereqs': 'Requiere completar antes:',
  'mapa.volver': 'Volver al menú',
  'mapa.ruta.pedagogica': 'Ruta pedagógica',
  'mapa.ruta.historica': 'Ruta histórica',

  // Rayo — escena cinematográfica
  'rayo.frase': 'Antes de toda óptica: un agujero, una flecha, y la oscuridad.',
  'rayo.titulo': 'El rayo de luz',
  'rayo.intuicion': 'La luz viaja en línea recta. Una cámara oscura lo demuestra: cada punto del objeto envía rayos en todas direcciones; solo los que pasan por el agujero llegan a la pared, dibujando la imagen invertida.',
  'rayo.deduccion.titulo': 'Propagación rectilínea',
  'rayo.deduccion.texto': 'Imagen invertida = trayectorias rectas + selección de apertura',
  'rayo.deduccion.derivacion': 'Los rayos del extremo superior de la flecha que pasan por el agujero llegan al extremo inferior de la imagen, y viceversa. La inversión es consecuencia directa de la geometría rectilínea.',
  'rayo.deduccion.ver': 'Ver por qué se invierte',
  'rayo.deduccion.ocultar': 'Ocultar deducción',
  'rayo.comenzar': 'Abrir la cámara oscura',

  // Reflexión — escena cinematográfica
  'reflexion.frase': 'El espejo no miente — devuelve exactamente lo que recibe.',
  'reflexion.titulo': 'Reflexión',
  'reflexion.intuicion': 'El ángulo de incidencia es igual al ángulo de reflexión. El espejo plano conserva el ángulo porque la componente normal del rayo invierte su signo y la tangencial se preserva.',
  'reflexion.deduccion.titulo': 'Ley de reflexión',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': 'La normal al espejo es el eje de simetría: el rayo incidente y el reflejado forman ángulos iguales con ella. Esto equivale a invertir solo la componente perpendicular al espejo.',
  'reflexion.deduccion.ver': 'Ver deducción',
  'reflexion.deduccion.ocultar': 'Ocultar deducción',
  'reflexion.comenzar': 'Explorar el espejo',

  // Fermat — escena cinematográfica (capítulo completo)
  'fermat.frase': 'La naturaleza es perezosa. Toma siempre el camino que cuesta menos tiempo.',
  'fermat.titulo.escena': 'Principio de Fermat',
  'fermat.intuicion': 'Reflexión y refracción no son leyes independientes. Son consecuencias del mismo principio: la luz toma el camino de tiempo estacionario. Mueve el punto de rebote y observa cómo el tiempo se minimiza exactamente cuando θᵢ = θᵣ.',
  'fermat.deduccion.titulo': 'Tiempo estacionario',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflexión)  |  n₁ sin θ₁ = n₂ sin θ₂  (refracción)',
  'fermat.deduccion.derivacion': 'Derivar el tiempo de viaje respecto al punto de reflexión P e igualar a cero. La condición δt/δP = 0 implica ángulos iguales en reflexión y la ley de Snell en refracción.',
  'fermat.deduccion.ver': 'Ver el principio',
  'fermat.deduccion.ocultar': 'Ocultar deducción',
  'fermat.comenzar': 'Explorar el mínimo',

  // Banco óptico — rayo/pinhole
  'bench.pinhole.instruccion': 'Observa cómo la imagen se invierte al pasar por el agujero',
  'bench.pinhole.completar': '¡Proyección invertida observada! La luz viaja en línea recta.',

  // Banco óptico — reflexión
  'bench.reflexion.instruccion': 'Arrastra el rayo para cambiar el ángulo de incidencia',
  'bench.reflexion.blanco': 'Haz rebotar el rayo hacia el blanco',
  'bench.reflexion.exito': '¡Impacto! θᵢ = θᵣ — la ley de reflexión en acción.',

  // Fermat reflexión
  'fermat.reflexion.titulo': 'Fermat en el espejo',
  'fermat.reflexion.instruccion': 'Arrastra el punto P sobre el espejo para minimizar el tiempo de viaje.',
  'fermat.reflexion.minimo': '¡Tiempo mínimo! — θᵢ = θᵣ se cumple aquí.',

  // Desbloqueos adicionales
  'desbloqueo.fuente': '¡Herramienta desbloqueada: Fuente de luz!',
  'desbloqueo.fuente.descripcion': 'Ahora puedes añadir fuentes de luz en el banco libre.',
  'desbloqueo.espejo-plano': '¡Herramienta desbloqueada: Espejo plano!',
  'desbloqueo.espejo-plano.descripcion': 'Ahora puedes añadir espejos planos en el banco libre.',
} as const;
