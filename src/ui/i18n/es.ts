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
  'refraccion.intuicion': 'Imagina un soldado marchando en formación hacia el barro: la fila que toca el barro primero frena, y la formación gira. La luz hace lo mismo al cruzar entre dos medios: cambia de velocidad y cambia de dirección. Cuanto mayor el salto de índice, mayor la doblez. Snell lo capturó en una sola ecuación.',
  'refraccion.deduccion.titulo': 'Ley de Snell',
  'refraccion.deduccion.texto': 'n₁ sin θ₁ = n₂ sin θ₂',
  'refraccion.deduccion.derivacion': 'El principio de Fermat exige que el tiempo de viaje sea estacionario. Igualar las derivadas del tiempo respecto al punto de cruce conduce a n₁ sin θ₁ = n₂ sin θ₂. El índice n = c/v mide cuánto frena el medio a la luz: a mayor n, menor velocidad y mayor doblez.',
  'refraccion.deduccion.ver': 'Ver deducción',
  'refraccion.deduccion.ocultar': 'Ocultar deducción',
  'refraccion.comenzar': 'Explorar el banco',
  'refraccion.guia.objetivo': 'Arrastra el punto P sobre la interfaz y observa cómo el camino óptico total cambia. Búscalo en el mínimo: ahí θ₁ y θ₂ satisfacen la ley de Snell exacta.',
  'refraccion.guia.pista': 'Mueve P hacia arriba y hacia abajo. El camino óptico (mostrado en el panel) baja, llega a un mínimo y luego sube. El mínimo es donde la luz realmente pasa.',

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
  'rayo.intuicion': 'La luz no dobla esquinas: viaja recta y terca hasta chocar con algo. Por eso un simple agujero basta para dibujar el mundo —al revés—. Cada punto de la flecha dispara un rayo recto que cruza el orificio y cae en el lado opuesto: arriba se vuelve abajo. Aristóteles ya lo veía en las sombras moteadas bajo los árboles.',
  'rayo.deduccion.titulo': 'Propagación rectilínea',
  'rayo.deduccion.texto': 'Imagen invertida = trayectorias rectas + selección de apertura',
  'rayo.deduccion.derivacion': 'Los rayos del extremo superior de la flecha que pasan por el agujero llegan al extremo inferior de la imagen, y viceversa. La inversión es consecuencia directa de la geometría rectilínea. Agranda el agujero: entran más rayos, la imagen se disuelve. Ciérralo: se vuelve nítida pero oscura. El desenfoque no es falla del agujero —es geometría pura.',
  'rayo.deduccion.ver': 'Ver por qué se invierte',
  'rayo.deduccion.ocultar': 'Ocultar deducción',
  'rayo.comenzar': 'Abrir la cámara oscura',
  'rayo.guia.objetivo': 'Agarra la flecha naranja y deslízala por el banco —acércala al agujero y aléjala—. Mira cómo su gemela del otro lado se da vuelta. Cuando entiendas por qué se invierte, pulsa «Lo veo invertido».',
  'rayo.guia.pista': 'Arrastra la punta de la flecha a lo largo del eje y observa qué le pasa a la imagen al acercarte al agujero. La imagen crece porque los rayos divergen más.',

  // Reflexión — escena cinematográfica
  'reflexion.frase': 'El espejo no miente — devuelve exactamente lo que recibe.',
  'reflexion.titulo': 'Reflexión',
  'reflexion.intuicion': 'Un espejo no inventa nada: te devuelve cada rayo con el mismo ángulo con que llegó, como una pelota contra una pared perfecta. Herón de Alejandría lo intuyó hace dos mil años —y añadió algo bello: la luz elige siempre el camino más corto. El espejo es, en el fondo, un principio de economía.',
  'reflexion.deduccion.titulo': 'Ley de reflexión',
  'reflexion.deduccion.texto': 'θᵢ = θᵣ',
  'reflexion.deduccion.derivacion': 'La normal al espejo es el eje de simetría: el rayo incidente y el reflejado forman ángulos iguales con ella. Esto equivale a invertir solo la componente perpendicular al espejo. Herón demostró que este camino es el mínimo: cualquier otro punto de reflexión haría el recorrido más largo.',
  'reflexion.deduccion.ver': 'Ver deducción',
  'reflexion.deduccion.ocultar': 'Ocultar deducción',
  'reflexion.comenzar': 'Explorar el espejo',
  'reflexion.guia.objetivo': 'Gira el rayo arrastrándolo hasta que, tras rebotar en el espejo, dé justo en la diana. Fíjate en el HUD: el ángulo de entrada y el de salida son gemelos.',
  'reflexion.guia.pista': 'Arrastra el extremo del rayo hacia arriba o hacia abajo. La diana está en el eje óptico (centro). Cuando θᵢ = θᵣ, el rayo reflejado apunta directo a ella.',

  // Fermat — escena cinematográfica (capítulo completo)
  'fermat.frase': 'La naturaleza es perezosa. Toma siempre el camino que cuesta menos tiempo.',
  'fermat.titulo.escena': 'Principio de Fermat',
  'fermat.intuicion': 'Reflexión y refracción no son leyes independientes: son dos caras del mismo principio. La luz actúa como un mensajero que siempre elige la ruta más rápida entre dos puntos. Mueve el punto de rebote en el espejo y verás cómo el camino óptico se estrecha hacia un mínimo preciso —justo donde θᵢ = θᵣ. La ley de reflexión no es un axioma: es una consecuencia.',
  'fermat.deduccion.titulo': 'Tiempo estacionario',
  'fermat.deduccion.texto': 'δt = 0  →  θᵢ = θᵣ  (reflexión)  |  n₁ sin θ₁ = n₂ sin θ₂  (refracción)',
  'fermat.deduccion.derivacion': 'Derivar el tiempo de viaje respecto al punto de reflexión P e igualar a cero. La condición δt/δP = 0 implica ángulos iguales en reflexión y la ley de Snell en refracción. El «mínimo» es en realidad un punto estacionario: puede ser mínimo, máximo o punto de silla dependiendo de la geometría. Fermat lo entendió como «tiempo mínimo»; la versión moderna habla de tiempo estacionario.',
  'fermat.deduccion.ver': 'Ver el principio',
  'fermat.deduccion.ocultar': 'Ocultar deducción',
  'fermat.comenzar': 'Explorar el mínimo',
  'fermat.guia.objetivo': 'Arrastra el punto de rebote P a lo largo del espejo. El panel inferior muestra el camino óptico total A→P→B. Encuéntralo en su mínimo: ese es el punto donde la luz realmente rebota, y ahí θᵢ = θᵣ.',
  'fermat.guia.pista': 'Mueve P hacia la izquierda y la derecha. El camino óptico dibuja una parábola: el mínimo está en el fondo. Cuando la barra de camino óptico deje de bajar y empiece a subir, habrás encontrado el punto de Fermat.',

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
  'dispersion.intuicion': 'El blanco no es un color: es todos a la vez, viajando juntos. El vidrio los frena de forma distinta —el violeta más que el rojo— y al salir se abren en abanico. Newton lo entendió con un prisma y un cuarto a oscuras. Y ojo: el color no está en la luz, está en ti, en los conos de tu retina que interpretan cada frecuencia.',
  'dispersion.deduccion.titulo': 'Ecuación de Sellmeier',
  'dispersion.deduccion.texto': 'n²(λ) = 1 + Σ Bᵢλ² / (λ² − Cᵢ)',
  'dispersion.deduccion.derivacion': 'Los electrones ligados del vidrio tienen frecuencias de resonancia. Cerca de cada resonancia el índice sube bruscamente (dispersión anómala). Lejos de ellas, n disminuye con λ (dispersión normal). El número de Abbe V = (nD−1)/(nF−nC) mide cuánto dispersa un material. El BK7 de este banco tiene V ≈ 64: dispersa poco —bueno para óptica de precisión.',
  'dispersion.deduccion.ver': 'Ver la ecuación',
  'dispersion.deduccion.ocultar': 'Ocultar deducción',
  'dispersion.comenzar': 'Abrir el prisma',
  'dispersion.guia.objetivo': 'Gira el prisma arrastrando el rayo incidente. Busca el ángulo donde el espectro de colores se abre más limpiamente —la desviación mínima—. Cuando lo encuentres, pulsa el botón para confirmar.',
  'dispersion.guia.pista': 'Arrastra el rayo hacia ángulos de incidencia más pequeños. Verás que la desviación del espectro primero baja y luego sube. El mínimo es donde la luz pasa simétricamente por el prisma.',

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
  'lentes.intuicion': 'Una lente es un prisma curvado: cada zona desvía la luz un poco más que la anterior, y todas las desviaciones confluyen en el mismo punto. El resultado paraxial es elegante —y casi mágico—: sin importar de qué altura del objeto salga el rayo, llega al mismo punto imagen. La ecuación de Gauss captura esa elegancia en tres términos.',
  'lentes.deduccion.titulo': 'Ecuación de Gauss',
  'lentes.deduccion.texto': '1/s + 1/s′ = 1/f   |   m = −s′/s',
  'lentes.deduccion.derivacion': 'Para s > f la imagen es real e invertida (m < 0). Para s < f la imagen es virtual y derecha (m > 0). En s = 2f el aumento es −1: la imagen es del mismo tamaño y está también a 2f —objeto e imagen intercambian roles, una simetría preciosa. La construcción geométrica usa tres rayos principales: paralelo al eje → por foco imagen; por centro óptico → sin desvío; por foco objeto → paralelo al eje.',
  'lentes.deduccion.ver': 'Ver la deducción',
  'lentes.deduccion.ocultar': 'Ocultar deducción',
  'lentes.comenzar': 'Explorar la lente',
  'lentes.guia.objetivo': 'Arrastra el objeto (flecha ámbar) hacia la derecha hasta colocarlo en 2f —la guía punteada te indica dónde está 2f—. Cuando el aumento m ≈ −1, la imagen real invertida tiene el mismo tamaño que el objeto.',
  'lentes.guia.pista': 'Busca la línea punteada vertical a la izquierda de la lente: esa es la posición 2f. Coloca la base de la flecha justo sobre esa línea. El HUD te mostrará m = −1.00 cuando lo logres.',

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

  // Aberraciones — escena cinematográfica
  'aberraciones.frase': 'La lente ideal no existe. El mundo real difumina.',
  'aberraciones.titulo': 'Aberraciones',
  'aberraciones.intuicion': 'La lente perfecta vive solo en los libros. En la realidad, los rayos que rozan el borde de la lente se doblan un poco más que los que pasan por el centro, y cada color enfoca en un lugar distinto. El resultado: una mancha borrosa donde debería haber un punto. La solución más antigua es también la más elegante —cerrar el diafragma y dejar pasar solo los rayos bien portados.',
  'aberraciones.deduccion.titulo': 'Aberración esférica y cromática',
  'aberraciones.deduccion.texto': 'LSA = f_marginal − f_paraxial  |  LCA = f_azul − f_rojo',
  'aberraciones.deduccion.derivacion': 'La aberración esférica longitudinal (LSA) mide cuánto se desplaza el foco marginal respecto al paraxial. Para una lente simple converge a cero solo con un diafragma infinitamente pequeño. La aberración cromática longitudinal (LCA) viene de n(λ): el azul (λ pequeña, n mayor) enfoca más cerca. Los dobletes acromáticos igualan f_azul ≈ f_rojo usando dos materiales de distinto número de Abbe —la solución que usan todos los telescopios de calidad.',
  'aberraciones.deduccion.ver': 'Ver la aberración',
  'aberraciones.deduccion.ocultar': 'Ocultar deducción',
  'aberraciones.comenzar': 'Explorar el banco',
  'aberraciones.guia.objetivo': 'Arrastra el borde del diafragma hacia adentro para cerrar la apertura por debajo del 25 %. Observa cómo la mancha de aberración se encoge. A menor apertura, mayor nitidez —pero también menos luz.',
  'aberraciones.guia.pista': 'Arrastra el borde superior del diafragma (la línea brillante) hacia abajo. El HUD muestra LSA en tiempo real: cuando baje a casi cero, la aberración esférica estará controlada.',

  // Aberraciones — banco
  'aberraciones.bench.instruccion': 'Arrastra para ajustar la apertura del diafragma',
  'aberraciones.bench.apertura': 'Apertura',
  'aberraciones.bench.lsa': 'LSA (esférica)',
  'aberraciones.bench.lca': 'LCA (cromática)',
  'aberraciones.bench.objetivo': 'Cierra el diafragma para reducir la aberración esférica',
  'aberraciones.bench.completar': '¡Aberración minimizada! El diafragma es la solución.',
  'aberraciones.bench.focoParaxial': 'Foco paraxial',
  'aberraciones.bench.focoMarginal': 'Foco marginal',

  // Desbloqueo aberraciones
  'desbloqueo.diafragma': '¡Herramienta desbloqueada: Diafragma!',
  'desbloqueo.diafragma.descripcion': 'Ahora puedes añadir diafragmas para controlar la apertura en el banco libre.',

  // Instrumentos ópticos — escena cinematográfica
  'instrumentos.frase': 'Dos lentes y el infinito cabe en tu ojo.',
  'instrumentos.titulo': 'Instrumentos ópticos',
  'instrumentos.intuicion': 'Galileo apuntó al cielo con dos lentes y vio las lunas de Júpiter. El secreto: la primera lente forma una imagen pequeña del objeto lejano; la segunda la usa como lupa. Cuando la separación entre ellas es exactamente f₁ + f₂ —configuración afocal—, los rayos salen paralelos y el ojo no se fuerza. Mover esa separación es la diferencia entre ver borroso y ver las lunas.',
  'instrumentos.deduccion.titulo': 'Aumento angular del telescopio',
  'instrumentos.deduccion.texto': 'M = −f₁/f₂   (afocal: d = f₁ + f₂)',
  'instrumentos.deduccion.derivacion': 'El objetivo forma la imagen del objeto lejano en su plano focal posterior (x = f₁). El ocular se coloca a distancia f₂ de esa imagen. Con d = f₁ + f₂ la imagen final está en el infinito: los rayos salen paralelos. El ángulo de salida es M veces el de entrada (M negativo = imagen invertida). La lupa amplía con una sola lente (M ≈ 25/f cm); el microscopio usa dos lentes con imagen intermedia real entre ellas.',
  'instrumentos.deduccion.ver': 'Ver el telescopio',
  'instrumentos.deduccion.ocultar': 'Ocultar deducción',
  'instrumentos.comenzar': 'Construir el telescopio',
  'instrumentos.guia.objetivo': 'Arrastra la segunda lente (ocular) para ajustar la separación d entre las dos lentes. Cuando d ≈ f₁ + f₂, los rayos salen paralelos y el HUD marcará «Afocal ✓». Ese es el telescopio.',
  'instrumentos.guia.pista': 'El HUD muestra la separación actual d y el valor objetivo f₁+f₂. Acerca la segunda lente a la primera hasta que los dos valores coincidan. Los rayos del lado derecho se volverán paralelos.',

  // Instrumentos — banco
  'instrumentos.bench.instruccion': 'Arrastra para ajustar la separación entre las lentes',
  'instrumentos.bench.separacion': 'Separación d',
  'instrumentos.bench.f1f2': 'f₁ + f₂',
  'instrumentos.bench.aumento': 'Aumento angular M',
  'instrumentos.bench.objetivo.instruccion': 'Ajusta la separación hasta d ≈ f₁ + f₂ (configuración afocal)',
  'instrumentos.bench.completar': '¡Telescopio afocal! Los rayos salen paralelos.',
  'instrumentos.bench.afocal': 'Afocal ✓',

  // Desbloqueo instrumentos
  'desbloqueo.sistema-multi-elemento': '¡Herramienta desbloqueada: Sistema multi-elemento!',
  'desbloqueo.sistema-multi-elemento.descripcion': 'Ahora puedes combinar múltiples lentes y espejos en el banco libre.',
} as const;
