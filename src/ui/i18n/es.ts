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

  // Dispersión — escena cinematográfica
  'dispersion.frase': 'El blanco no es un color. Es todos los colores a la vez.',
  'dispersion.titulo': 'Dispersión y color',
  'dispersion.intuicion': 'El índice de refracción depende de la longitud de onda. El prisma no crea colores — los separa. El color no está en la luz: está en ti, en los conos de tu retina que interpretan cada frecuencia.',
  'dispersion.deduccion.titulo': 'Ecuación de Sellmeier',
  'dispersion.deduccion.texto': 'n²(λ) = 1 + Σ Bᵢλ² / (λ² − Cᵢ)',
  'dispersion.deduccion.derivacion': 'Los electrones ligados del vidrio tienen frecuencias de resonancia. Cerca de cada resonancia el índice sube bruscamente (dispersión anómala). Lejos de ellas, n disminuye con λ (dispersión normal). El número de Abbe V = (nD−1)/(nF−nC) mide cuánto dispersa un material.',
  'dispersion.deduccion.ver': 'Ver la ecuación',
  'dispersion.deduccion.ocultar': 'Ocultar deducción',
  'dispersion.comenzar': 'Abrir el prisma',

  // Dispersión — banco
  'dispersion.bench.instruccion': 'Arrastra el prisma (o ajusta la incidencia) para explorar el espectro',
  'dispersion.bench.desviacion': 'Desviación',
  'dispersion.bench.lambda': 'λ dominante',
  'dispersion.bench.minimo': '¡Desviación mínima! El espectro es más limpio aquí.',
  'dispersion.bench.completar': '¡Espectro separado! La luz blanca revela sus colores.',
  'dispersion.objetivo.instruccion': 'Gira el prisma hasta alcanzar la desviación mínima',

  // Desbloqueo dispersión
  'desbloqueo.espectrometro': '¡Herramienta desbloqueada: Espectrómetro!',
  'desbloqueo.espectrometro.descripcion': 'Ahora puedes analizar el espectro de fuentes en el banco libre.',

  // Lentes — escena cinematográfica
  'lentes.frase': 'Una lente no dobla la luz — la convoca en un punto.',
  'lentes.titulo': 'Lentes y espejos curvos',
  'lentes.intuicion': 'La lente delgada aplica Snell en dos superficies. El resultado paraxial es elegante: todos los rayos de un punto objeto convergen en un punto imagen. La ecuación de Gauss une objeto, imagen y distancia focal.',
  'lentes.deduccion.titulo': 'Ecuación de Gauss',
  'lentes.deduccion.texto': '1/s + 1/s′ = 1/f   |   m = −s′/s',
  'lentes.deduccion.derivacion': 'Para s > f la imagen es real e invertida (m < 0). Para s < f la imagen es virtual y derecha (m > 0). En s = 2f el aumento es −1: la imagen es del mismo tamaño y está también a 2f. La construcción geométrica usa tres rayos principales: paralelo al eje → por foco imagen; por centro óptico → sin desvío; por foco objeto → paralelo al eje.',
  'lentes.deduccion.ver': 'Ver la deducción',
  'lentes.deduccion.ocultar': 'Ocultar deducción',
  'lentes.comenzar': 'Explorar la lente',

  // Lentes — banco
  'lentes.bench.instruccion': 'Arrastra el objeto para cambiar la distancia s',
  'lentes.bench.s': 's (objeto)',
  'lentes.bench.sPrima': "s′ (imagen)",
  'lentes.bench.m': 'm (aumento)',
  'lentes.bench.f': 'f (focal)',
  'lentes.bench.real': 'real',
  'lentes.bench.virtual': 'virtual',
  'lentes.bench.objetivo': 'Coloca el objeto en 2f para obtener m = −1',
  'lentes.bench.completar': '¡Imagen nítida en 2f! Aumento exactamente −1.',

  // Desbloqueo lentes
  'desbloqueo.lente': '¡Herramienta desbloqueada: Lente delgada!',
  'desbloqueo.lente.descripcion': 'Ahora puedes añadir lentes convergentes y divergentes en el banco libre.',
} as const;
