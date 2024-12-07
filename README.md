

*Game Design Document*

**Hotline Miauami**

**Grupo 07:**

Adrián Espínola Gumiel 	[a.espinola.2022@alumnos.urjc.es](mailto:a.espinola.2022@alumnos.urjc.es) 		idarkar3000  
Antonio Machorro Herrera	[a.machorro.2024@alumnos.urjc.es](mailto:a.machorro.2024@alumnos.urjc.es) 		antonioMachorro  
Laura Manso Herrero 		[l.manso.2022@alumnos.urjc.es](mailto:l.manso.2022@alumnos.urjc.es)		laurimans  
David Antonio Paz Gullón	[da.paz.2022@alumnos.urjc.es](mailto:da.paz.2022@alumnos.urjc.es)		DavidPazUni  
Álvaro Rosa Pedraza 		[a.rosa.2022@alumnos.urjc.es](mailto:a.rosa.2022@alumnos.urjc.es)		alvaroRosa23

**ÍNDICE**

[**1\. Introducción	2**](#introducción)

[1.1. Concepto del juego	2](#concepto-del-juego)

[1.2. Género	2](#género)

[1.3. Características principales	2](#características-principales)

[1.4. Propósito	3](#propósito)

[1.5. Público objetivo	3](#público-objetivo)

[1.6. Modelo de Negocio	4](#modelo-de-negocio)

[1.7. Licencia	4](#licencia)

[1.8. PEGI	5](#pegi)

[1.9. Estilo visual	5](#estilo-visual)

[1.10. Narrativa	5](#narrativa)

[**2\. Mecánicas de juego	6**](#mecánicas-de-juego)

[2.1. Estructura general	6](#estructura-general)

[2.2. Mecánicas de movimientos y habilidades	6](#mecánicas-de-movimientos-y-habilidades)

[2.3. Mecánicas de Escenario	7](#mecánicas-de-escenario)

[2.4. Bonificaciones y potenciadores	7](#bonificaciones-y-potenciadores)

[2.5. Flujo de juego	8](#flujo-de-juego)

[2.6. Controles	8](#controles)

[**3\. Interfaz	10**](#interfaz)

[3.1. Diagrama de estados	10](#diagrama-de-estados)

[3.2. Título	11](#título)

[3.3. Menú principal	11](#menú-principal)

[3.4. Menú Elección Modo de Juego	12](#menú-elección-modo-de-juego)

[3.5. Menú Selección Roles	12](#menú-selección-roles)

[3.6. Partida	13](#partida)

[3.7. Resultados Ronda	14](#resultados-ronda)

[3.8. Pantalla Victoria Derrota	14](#pantalla-victoria-derrota)

[3.9. Menú Pausa	15](#menú-pausa)

[3.10. Ajustes	15](#ajustes)

[3.11. Créditos	16](#créditos)

[**4\. Arte	17**](#arte)

[4.1. Arte 2D	17](#arte-2d)

[4.2. Audio	24](#audio)

[4.2.1. Música	24](#música)

[4.2.2. Efectos de sonido	24](#efectos-de-sonido)

# 

1. # **Introducción** 

   1. ## **Concepto del juego** 

*“Hotline Miauami”* es un juego multijugador de persecución 2D, donde un jugador asume el papel de "Policía" y el otro, el de "Ladrón". El objetivo del policía es atrapar al ladrón antes de que el tiempo se acabe, mientras que el del ladrón es evadir al policía y evitar ser atrapado dentro del tiempo establecido. El juego se desarrolla en un escenario 2D con plataformas, obstáculos y bonificaciones que pueden ser usados ​​para escapar, obstaculizar el paso o perjudicar al oponente.

2. ## **Género** 

*“Hotline Miauami”* combina dos géneros clave: acción en tercera persona y plataformas 2D, creando una experiencia dinámica y competitiva en tiempo real.

- **Acción en tercera persona**: En este aspecto, el jugador tiene control total de su personaje desde una vista lateral, lo que le permite ver no solo a su propio personaje, sino también su entorno y la posición del oponente. Esta perspectiva añade un componente estratégico, ya que los jugadores pueden planificar sus movimientos mientras observan las rutas y los obstáculos en el nivel. La acción es rápida y fluida, y gracias al uso del temporizador se incita a los jugadores a tomar decisiones velozmente y bajo presión.

- **Plataformas 2D**: El uso de plataformas añade complejidad a la persecución. Los jugadores deben saltar, trepar y usar los elementos del entorno para avanzar, escapar o interceptar al oponente. Las plataformas están diseñadas para fomentar la habilidad y el ingenio, ya que el jugador que mejor maneje el terreno y los obstáculos tendrá una ventaja significativa. Los niveles incluirán múltiples rutas, alturas variables, y elementos móviles que crean un entorno dinámico y desafiante.

La fusión de estos dos géneros crea una jugabilidad rápida, competitiva y variada. Además, los objetos y bonificaciones presentes en los escenarios añaden aún más variedad al gameplay. Esto convierte cada partida en una experiencia única llena de emoción, tensión  y estrategia en tiempo real.

3. ## **Características principales** 

Las características principales del juego son:

* **Roles**:

  * **Policía**: Su objetivo es claro y directo: atrapar al ladrón antes de que el tiempo se acabe. El jugador en este rol debe ser estratégico en su persecución, anticiparse a los movimientos del ladrón y usar el terreno a su favor para acortar distancias y bloquear rutas de escape.

  * **Ladrón**: En contraste, el objetivo del ladrón es evadir al policía usando todas las herramientas disponibles en el entorno. El ladrón debe ser rápido, astuto y tener un buen conocimiento del terreno para aprovechar los obstáculos , haciendo que su rol se enfoque más en la evasión y el uso táctico del entorno.

* **Escenario estático con obstáculos**: Cada partida se desarrolla en un escenario estático en 2D, lo que significa que el mapa no cambia durante el transcurso de la partida. Sin embargo, el nivel está lleno de plataformas y obstáculos que hacen que el terreno sea variado y lleno de desafíos. 

* **Sistema victoria/derrota por rondas al mejor de tres**

* **Partida a contrarreloj:** Este mecanismo crea un ambiente tenso durante las partidas.

* **Bonificaciones por el escenario que perjudican al rival:** En el mapa aparecerán bonificaciones que, al ser recogidas podrán usarse para ganar ventaja o perjudicar al rival.


  4. ## **Propósito** 

El propósito del juego es proporcionar una experiencia de juego rápida, intensa y divertida, centrada en la persecución y la evasión. Este juego fomenta la competencia entre dos jugadores. El juego está diseñado para ser accesible pero desafiante, permitiendo que los jugadores disfruten de sesiones cortas y emocionantes, con la posibilidad de partidas rápidas.

* **Entretenimiento competitivo**: Incentivar la competencia directa entre dos jugadores mediante habilidades y estrategias asimétricas.

* **Repetibilidad**: Ofrecer partidas cortas pero con una gran rejugabilidad.

* **Estrategia y agilidad**: Requiere destreza, reflejos rápidos y una buena lectura del entorno para evadir o capturar.

  5. ## **Público objetivo** {#público-objetivo}

*“Hotline Miauami”* está orientado al siguiente público

* **Adolescentes y adultos jóvenes (13-35 años):**   
  El juego está diseñado para un público que disfrute de partidas rápidas y competitivas, ideal para aquellos que buscan diversión directa y multijugador inmediato.

## 


* **Jugadores ocasionales y competitivos:**

  * **Jugadores casuales:** Pueden disfrutar de mecánicas sencillas y partidas rápidas, lo que hace que sea fácil de aprender y empezar a jugar en poco tiempo.

  * **Jugadores competitivos:** Ofrece un equilibrio de habilidades y estrategias que pueden ser dominadas, lo que atrae a jugadores que buscan mejorar su destreza o desafiar a otros.

* **Amantes de los juegos multijugador:**  
  Ideal para personas que disfrutan de juegos **1v1 multijugador** locales o en línea, con un enfoque en la **acción rápida** y la competencia directa.

* **Jugadores en plataforma PC:**

  El juego se va a desarrollar para PC.


  6. ## **Modelo de Negocio** 

Hotline Miauami se distribuirá como un juego gratuito para navegador web, accesible a través de una página oficial. Este modelo busca maximizar la accesibilidad y el alcance del público, especialmente entre jugadores casuales. Las estrategias de monetización serán:

* **Anuncios no intrusivos**: Publicidad breve antes de comenzar las partidas y entre rondas, respetando la experiencia del jugador.  
    
* **Donaciones voluntarias**: Inclusión de un sistema de apoyo tipo "pay what you want" para que los jugadores puedan contribuir al desarrollo si lo desean.

El enfoque es mantener todas las mecánicas centrales del juego accesibles para todos los usuarios sin barreras económicas.

7. ## **Licencia** 

El juego se distribuirá bajo una licencia gratuita para uso personal, permitiendo a los jugadores disfrutarlo directamente desde el navegador.

* **Código cerrado**: El código fuente no será accesible para evitar modificaciones no autorizadas o clonación.  
    
* **Autorización para retransmisión**: Los creadores de contenido podrán compartir partidas en plataformas como YouTube o Twitch, incentivando la promoción orgánica.  
    
* **Prohibición de uso comercial no autorizado**: Ningún tercero podrá monetizar el juego sin consentimiento del equipo desarrollador.

  8. ## **PEGI** 

Hotline Miauami tiene una clasificación de PEGI 7\. Una restricción de edad poco elevada por los siguientes motivos:

* **Violencia leve y caricaturesca**: Las acciones del policía y el ladrón están representadas de forma cómica y sin realismo explícito, evitando cualquier contenido perturbador.  
    
* **Temática amigable**: Aunque hay elementos de persecución y competencia, la estética de pixel art y el diseño de personajes animales minimizan cualquier impacto negativo.


Esta clasificación permite que el juego sea accesible para un público amplio, incluyendo jugadores jóvenes y adolescentes, sin comprometer la diversión para audiencias mayores.

9. ## **Estilo visual**  

“*Hotline Miauami”* tendrá un estilo visual **pixel art** que aportará un aspecto retro y nostálgico con toques modernos. Se ha elegido esta estética para poder crear una experiencia visual atractiva y con identidad,  lograr claridad visual y transmitir información rápidamente.

10. ## **Narrativa** 

El jefe de policía Oinkson ha jurado mantener la paz en Miauami, la paz en una ciudad que nunca duerme. Sin embargo, desde hace muchos años su mayor desafío ha sido atrapar al escurridizo ladrón Michigan conocido por su habilidad para escapar de la ley, desapareciendo como un fantasma.

Una noche, el trabajo de investigación de Oinkson dio como resultado anticiparse a un robo de Michigan, desembocando así en una persecución por los recovecos de la ciudad. Para Oinkson no solo es un delito más, es una cuestión personal tras meses sin atrapar a Michigan sin resultados.

El destino y la paz de la ciudad están en juego.

2. # **Mecánicas de juego** 

El juego se centra en la **persecución 1v1** en un escenario 2D con plataformas. Uno de los jugadores asumirá el rol de **Policía** y el otro el de **Ladrón.** Deberán utilizar el entorno, habilidades de su personaje y estrategia para cumplir con su objetivo: el Policía debe atrapar al Ladrón antes de que se acabe el tiempo, mientras que el Ladrón debe evadir al Policía.

1. ### **Estructura general** 

* **Duración de la Partida:** Cada partida consta de 3 rondas, en las que los jugadores intercambiarán los roles. Cada ronda dura 2 minutos.

* **Roles Asimétricos:** Los jugadores se alternan entre ser Policía o Ladrón en diferentes rondas.

* **Escenarios Dinámicos:** Los escenarios cambian entre rondas, ofreciendo nuevos desafíos y rutas de escape.

  2. ### **Mecánicas de movimientos y habilidades** {#mecánicas-de-movimientos-y-habilidades}

Cada rol tendrá sus propias mecánicas de movimiento y habilidades: 

* **Policía**  
  * **Velocidad:** El Policía tiene una velocidad menor que la del ladrón.

  * **Habilidad única:** El policía puede recoger y usar objetos para perjudicar al ladrón.

  * **Condición de victoria:** Si el policía alcanza al ladrón antes de que termine la ronda, este lo atrapará y ganará.

* **Ladrón**

  * **Velocidad:** El Ladrón es más rápido que el Policía.

  * **Habilidad única:** El ladrón puede manipular el terreno, activando trampas y obstáculos para entorpecer al policía, además de caber por huecos por los que el policía no.

  * **Condición de victoria:** El ladrón deberá de evitar ser capturado toda la ronda para ganar.

  3. ### **Mecánicas de Escenario** {#mecánicas-de-escenario}

Los escenarios 2D incluyen varias **plataformas** que los jugadores deben utilizar para moverse por el mapa. Las plataformas son estáticas, con rutas verticales y horizontales para escapar o interceptar, y están inspiradas en la estructura de un laberinto.

En el nivel hay **obstáculos interactivos** como trampillas y puertas que el ladrón puede usar para bloquear el camino o desplazarse a otra parte del escenario.

* **Puertas cerradas:** El ladrón puede cerrar puertas momentáneamente, bloqueando el camino al Policía. Las puertas se abrirán tras 3 segundos. 

* **Trampillas de transporte:** El ladrón puede utilizar alcantarillas, tubos y conductos de ventilación que podrá utilizar para transportarse a otro punto del mapa. Estas trampillas tienen 10 segundos de enfriamiento hasta que puedan volver a utilizarse.

![bocetoEscenario](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/bocetoMapa.png)

Boceto Sección de mapa

4. ### **Bonificaciones y potenciadores**  

En el escenario hay **bonificaciones** que aparecen de forma aleatoria en ciertas zonas del mapa. Saldrán 15 segundos después de usar la bonificación de tu inventario. La primera bonificación saldrá en pantalla al principio de la partida. El policía puede recoger estas bonificaciones y obtener ventajas temporales. Las habilidades son las siguientes:

* **Donut:** Incrementa la velocidad del personaje temporalmente. La habilidad activa durará 5 segundos.  
* **Red de Caza:** El Policía puede obtener una red para lanzar y paraliza al Ladrón por unos segundos. La habilidad activa durará 1.5 segundos.  
* **Cepo:** Disminuye la velocidad del ladrón temporalmente. La habilidad activa durará 3 segundos.  
* **Reloj:** Cuando el policía active esta bonificación se sumarán 20 sg al temporizador.

En el Modo en red se añadirá:

* **Capa de Invisibilidad:** El policía puede volverse invisible por un tiempo corto en la pantalla del rival. La habilidad activa durará 7 segundos.

El policía tendrá guardada la bonificación, hasta que decida usarla. Solo puede tener una bonificación guardada, por lo que si ya tiene una no podrá recoger otra más hasta que la active.

5. ## **Flujo de juego** 

El jugador inicia el juego y elige **Jugar Partida** en el menú principal. También podría acceder al menú de opciones o a los créditos. El jugador elige si quiere jugar de forma **Local o En Red**. Si el jugador escoge jugar en red, establece conexión con el otro jugador, se asignan los roles de manera aleatoria y ambos aceptan comenzar la partida. Si se escoge jugar en local, los jugadores pueden elegir los roles o asignarlos de manera aleatoria. Tras ello, empieza la ronda.

Se procede a explicar de forma detallada el flujo de una partida en *“Hotline Miauami”*. Al comenzar la partida, el temporizador de 2 minutos empezará a correr y los jugadores podrán controlar el movimiento de sus personajes, sean Ladrón o Policía.

Durante el transcurso de la partida, el Policía tiene que intentar atrapar al Ladrón persiguiéndole por el mapa. Si obtiene una de las tres bonificaciones que saldrán de forma aleatoria por el mapa, guardará esa habilidad en su inventario y la podrá usar cuando quiera usando la tecla Espacio. Al activar la bonificación, el policía desencadenará un efecto con un límite de tiempo. El Ladrón va a poder interactuar con puertas y trampillas en el mapa para cortar caminos al Policía o alejarse de él e impedir ser capturado. 

Si el Policía logra capturar al Ladrón, la ronda terminará y se sumará 1 punto al marcador del Policía. Si el tiempo se acaba y el Policía aún no ha logrado capturar al Ladrón, se sumará un punto al marcador del ladrón. La partida es al mejor de tres, cuando uno de los dos llegue a 2 puntos, la partida finalizará y obtendrá la victoria dicho jugador.

Cuando la partida termina, saldrá una pantalla de victoria/Derrota y ambos jugadores podrán volver al menú principal.

6. ## **Controles**

En el modo local, se usarán los siguientes controles:

* **Jugador 1**:

  * **A**: para moverse hacia la izquierda

  * **D**: para moverse hacia la derecha

  * **W**: para saltar

  * **S**: si eres ladrón, para deslizarse si está en movimiento.

  * **Space**: para activar trampa si eres ladrón o para usar bonificación si eres Policía

* **Jugador 2**:

  * **Flecha izquierda**: para moverse hacia la izquierda

  * **Flecha derecha**: para moverse hacia la derecha

  * **Flecha abajo**: si eres ladrón, para deslizarse si está en movimiento.

  * **Flecha arriba**: para saltar

  * **Shift Derecho**: para activar trampa si eres ladrón o para usar bonificación si eres Policía 

En el modo en red, se usarán los siguientes controles:

* Ambos roles comparten:

  * **A**: para moverse hacia la izquierda

  * **D**: para moverse hacia la derecha

  * **W**: para saltar

* El Ladrón tiene los siguientes controles propios:

  * **S**: para deslizarse si está en movimiento, agacharse si está parado o bajar de plataforma

  * **Space**: para activar una trampa en el mapa

* El Policía tiene los siguientes controles propios:

  * **Space**: para activar la bonificación

3. # **Interfaz** 

Se ha realizado un diagrama de flujo para visualizar cómo será la navegación entre las pantallas del juego. Después, se detalla cómo será cada una de estas pantallas.

1. ## **Diagrama de estados** {#diagrama-de-estados}

![diagrama](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/diagrama.png)

	

## 

2. ## **Título** 

   En el Título, únicamente aparecerá el logo del juego, una imagen de fondo y un texto que indica al jugador que clique el botón de jugar para seguir.

![titulo](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/titulo.png)

3. ## **Menú principal**

   En el menú principal, el jugador o jugadores podrán acceder a las opciones básicas del juego, incluyendo iniciar partida, modificar los ajustes y salir del juego.

   

   El menú principal contará con los siguientes botones:

   

* **Jugar:** Este botón lleva al jugador a la selección del modo de juego. Desde allí, se podrá escoger entre jugar de forma local o en red.


* **Opciones:** Al presionar este botón, el jugador accede al Menú de Ajustes, donde podrá modificar el volumen general.


* **Salir:** Este botón permite al jugador cerrar el juego. Se mostrará un mensaje de confirmación para evitar que el jugador cierre el juego por error.

![menu](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/menu.png)

4. ## **Menú Elección Modo de Juego** 

   En este menú el jugador elegirá qué modo quiere jugar, modo local o modo multijugador (aún no integrado).

![modo](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/modo.png)

   5. ## **Menú Selección Roles** 

   En esta pantalla, los jugadores podrán elegir un personaje o bien que el azar decida su rol.

![seleccion](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/seleccion.png)

6. ## **Partida** 

   En la pantalla de Partida es donde ocurrirá toda la acción. Los dos jugadores serán posicionados en el mapa, lejos el uno del otro. Al comenzar, ambos jugadores conseguirán el control de sus personajes para cumplir con su objetivo. En la interfaz, lo único que aparecerá será la cuenta atrás y la bonificación que tenga el policía.

![escenario](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/escenario.png)

   7. ## **Resultados Ronda** 

   Al finalizar cada ronda, se mostrará una pantalla de Resultados de Ronda sencilla, que indicará de forma clara si el jugador ha ganado o perdido la ronda, y mostrará el contador. Esta pantalla servirá como transición rápida hacia el cambio de rol de los jugadores y a la siguiente ronda.

   

![victoriaRonda](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/Captura_de_pantalla_44.png)

8. ## **Pantalla Victoria Derrota** 

   Cuando uno de los dos jugadores consigue ganar dos rondas, aparecerá esta pantalla. En ella se indicará qué jugador es el que ha ganado la partida.

   

![victoriaFinal](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/victoriaFinal.png)

9. ## **Menú Pausa** 

   Este menú flotante aparecerá cuando el jugador presione la tecla “ESC”, donde tendrá la opción de continuar, ir al menú de ajustes o de salir.

   

   En modo local, si uno de los dos jugadores presiona la tecla “ESC” se congelará el juego hasta que se pulse el botón de continuar.

   

   En el caso de que el modo de juego sea en red. Si uno de los dos jugadores pulsa la tecla “ESC”, el juego se congelará hasta que, o bien, el jugador presione el botón de continuar o pase 1 minuto.

   

![pausa](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/pausa.png)

10. ## **Ajustes**

Desde este menú el jugador podrá regular el volumen del juego.

![opciones](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/opciones.png)

11. ## **Créditos** 

En la pantalla de créditos se despliega un fondo repleto de patrones geométricos en colores neón. La música synthwave continúa sonando, creando un ambiente intenso y envolvente que recuerda a la estética del juego.

En el centro de la pantalla, los créditos comienzan a aparecer en un formato vertical. Cada nombre está escrito en una tipografía pixelada, colorida y de neón.

Al final de la lista de créditos, un mensaje final se deslizará lentamente hacia el centro: “Gracias por jugar”, seguido de una animación donde el fondo estalla en colores brillantes cerrando así la escena.  
![creditos](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/creditos.png)

4. # **Arte** {#arte}

   1. ## **Arte 2D** 

**Concepto General**

"Hotline Miauami" presenta un estilo artístico en pixel art de alta resolución, que evoca una estética retro. El estilo visual está inspirado en juegos como *The Binding of Isaac* (detalles caricaturescos y personajes únicos) y *Hotline Miami* (ambientación urbana, caos y colores saturados), combinando una paleta de colores variados con una atmósfera vibrante y dinámica.

![isaac](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/isaac.jpg) 		![hotline](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/hotline.jpg)

*The Binding of Isaac					Hotline Miami* 		

El juego sigue una temática de animales antropomorfos, ambientado en escenarios estáticos que recrean los suburbios de una ciudad moderna. Sin embargo, estos espacios se enriquecen con colores llamativos y detalles estéticos para realzar la sensación de un entorno urbano y excéntrico.

![gatoBoceto](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/gatoBoceto.png)    ![cerdoBoceto](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/cerdoBoceto.jpg)

*Imágenes de referencia de personajes*

**Paleta de color**

La paleta de colores combina tonos vivos y saturados para destacar elementos clave del juego, pero manteniendo cierta simplicidad en el fondo para no sobrecargar la pantalla.

* **Escenario:** El escenario tiene una paleta de colores que combina tonos oscuros y cálidos con colores contrastantes para aportar profundidad y riqueza visual al entorno. Los tonos principales incluyen un rojo oscuro, un morado, y un azul intenso.

![paleta1](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/paleta1.png)

* **Personajes:** Los personajes tienen colores más claros para contrastar con los escenarios, asegurando que sean fácilmente identificables en cualquier situación. Este enfoque mejora la claridad durante la jugabilidad y refuerza el protagonismo de los personajes en pantalla.

![paleta2.1](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/paleta2.1.png)    ![paleta2.2](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/paleta2.2.png)

**Escenario**

El escenario de *Hotline Miauami* está inspirado en los suburbios de una ciudad moderna. El mapa incluye una mezcla de áreas urbanas como edificios, zonas subterráneas y elementos distintivos que aportan variedad al entorno. Los escenarios están diseñados con una paleta de colores vibrantes que los hace visualmente atractivos, al tiempo que destacan elementos interactivos como puertas, trampillas u objetos del entorno que los jugadores pueden utilizar.

![escenario2](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/escenario2.jpg)

**Personajes**

El diseño de los personajes combina elementos humorísticos y estereotipados para reforzar la narrativa del juego. Cada personaje está cuidadosamente diseñado para reflejar su rol en el juego:

* **Policía**: Este personaje es una representación exagerada del típico policía visto en caricaturas y series. Su baja forma física y su uniforme demasiado ajustado transmiten una mezcla de autoridad cómica y descuido. Los rasgos de cerdo refuerzan la asociación cultural de glotonería o falta de agilidad, añadiendo un toque humorístico que se alinea con la narrativa del juego.

![bocetoCerdo](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/bocetoCerdo.png)

Concept Art Policia

![spriteCerdo](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/spriteCerdo.png)

Sprite Policía

* **Ladrón**: El ladrón, representado como un gato ágil y astuto, tiene un diseño delgado y estilizado para enfatizar su rapidez y destreza. Su antifaz, un recurso clásico del bandido, refuerza la idea de sigilo y malicia. Este diseño toma inspiración de personajes como los de *Sly Cooper*, equilibrando personalidad y funcionalidad en el juego.

![conceptLadron](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/conceptLadron.jpg)

Concept Art Ladrón

![spriteLadron](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/spriteLadron.png)

Sprite Ladrón

**Bonificaciones**

Cada una de las bonificaciones tiene su respectivo icono: Donut, Red de Caza, Bonificación de tiempo y Cepo. Se ha usado un dibujo representativo y un color diferente para cada una, para así poder distinguirlas y saber su utilidad a simple vista.

![bonificaciones_1](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/bonificaciones_1.png)

**Animaciones**

El juego presenta animaciones fluidas pero con el encanto limitado del pixel art clásico. Cada personaje cuenta con animaciones clave para reforzar sus personalidades y acciones

* **Policía**: Las animaciones del cerdo están diseñadas para enfatizar su aspecto pesado y torpe. Los movimientos son más lentos, con pasos pesados y exagerados que reflejan su cuerpo robusto y poco ágil.

![spritesheetPolicia](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/spritesheetPolicia.png)

## 

## 

* **Ladrón**: Las animaciones del gato están diseñadas para hacerlo lucir ligero y ágil. Sus movimientos son rápidos, fluidos y naturales, lo que refuerza su naturaleza escurridiza y astuta. Al correr o deslizarse, el gato se mueve con gran destreza y velocidad, transmitiendo una sensación de ligereza en cada acción. Además de los movimientos básicos, se ha animado al ladrón atrapado en una red y al ladrón con un cepo en la pierna, consecuencia de las bonificaciones de Red de Caza y Cepo, respectivamente.

![spritesheetLadron](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/spritesheetLadron.png)

* **Bonificaciones**: Se ha implementado una pequeña animación de movimiento vertical a las bonificaciones para darle dinamismo cuando aparezcan en el mapa. 

![spriteBonificadores](https://raw.githubusercontent.com/antonioMachorro/JuegosEnRed_Equipo07/main/ImagenesREADME/spriteBonificaciones.png)

También se ha implementado una animación de un destello, como retroalimentación visual de que la bonificación ha sido recogida.

## 

## 

## 

2. ## **Audio** 

   1. ### **Música**  

*“Hotline Miauami”* cuenta con música de **Persecución Synthwave (Retrowave)** 

El **synthwave**, con sus sintetizadores melódicos, ritmos electrónicos y tonos nostálgicos de los años 80, es el núcleo de la banda sonora. Este estilo captura perfectamente el ambiente de persecución, con melodías energéticas y envolventes que transmiten una sensación de urgencia y emoción.

Se han producido canciones para:

* **Menú:** La música del menú es constante con sintetizadores guardando la estética del videojuego. La profundidad y las diferentes capas que tiene la pieza hacen que ésta sea disfrutable y consistente.

* **Gameplay:** La música es más intensa y dinámica aportando a los jugadores tensión sonora que acompaña muy bien a lo que está sucediendo en pantalla. De nuevo, el uso de sintetizadores graves y percusión acorde hacen una experiencia sonora equilibrada con lo que se está viendo por pantalla.

  2. ### **Efectos de sonido** {#efectos-de-sonido}

Los efectos sonoros son esenciales para proporcionar retroalimentación al jugador. Acompañan perfectamente al gameplay y son pequeños detalles que aportan dinamismo a la partida y los menús. El juego cuenta con efectos de sonido para:

* Policía coge bonificación 

* Policía usa bonificación  

* Ladrón se mete por trampilla 

* Ladrón activa trampa 

* Interacción con los botones

## 

