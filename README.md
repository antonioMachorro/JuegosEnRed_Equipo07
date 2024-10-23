# Hotline Miauami

## Grupo 07:
- Adrián Espínola Gumiel ([a.espinola.2022@alumnos.urjc.es](mailto:a.espinola.2022@alumnos.urjc.es)) - idarkar3000
- Antonio Machorro Herrera ([a.machorro.2024@alumnos.urjc.es](mailto:a.machorro.2024@alumnos.urjc.es)) - antonioMachorro
- Laura Manso Herrero ([l.manso.2022@alumnos.urjc.es](mailto:l.manso.2022@alumnos.urjc.es)) - laurimans
- David Antonio Paz Gullón ([da.paz.2022@alumnos.urjc.es](mailto:da.paz.2022@alumnos.urjc.es)) - DavidPazUni
- Alvaro Rosa Pedraza ([a.rosa.2022@alumnos.urjc.es](mailto:a.rosa.2022@alumnos.urjc.es)) - alvaroRosa23

## Índice
1. [Introducción](#introducción)
   - [Concepto del juego](#concepto-del-juego)
   - [Género](#género)
   - [Características principales](#características-principales)
   - [Propósito](#propósito)
   - [Público objetivo](#público-objetivo)
   - [Estilo visual](#estilo-visual)
2. [Mecánicas de juego](#mecánicas-de-juego)
   - [Estructura general](#estructura-general)
   - [Mecánicas de movimientos y habilidades](#mecánicas-de-movimientos-y-habilidades)
   - [Mecánicas de escenario](#mecánicas-de-escenario)
   - [Bonificaciones y potenciadores](#bonificaciones-y-potenciadores)
   - [Flujo de juego](#flujo-de-juego)
   - [Controles](#controles)
3. [Interfaz](#interfaz)
   - [Diagrama de estados](#diagrama-de-estados)
   - [Pantallas del juego](#pantallas-del-juego)
4. [Arte](#arte)
   - [Arte 2D](#arte-2d)
   - [Audio](#audio)

## Introducción

### Concepto del juego
“Hotline Miauami” es un juego multijugador de persecución 2D. Un jugador asume el papel de **Policía** y el otro de **Ladrón**. El objetivo del policía es atrapar al ladrón antes de que se acabe el tiempo, mientras que el ladrón debe evadir al policía.

### Género
El juego combina:
- **Acción en tercera persona**: Control total del personaje en una vista lateral.
- **Plataformas 2D**: Escenarios con plataformas, rutas y obstáculos.

### Características principales
- **Roles**:
  - **Policía**: Persigue al ladrón y utiliza el entorno para atraparlo.
  - **Ladrón**: Evade al policía usando las plataformas y bonificaciones.
- **Escenario estático** con obstáculos.
- **Sistema de rondas** al mejor de tres.
- **Partida a contrarreloj** con bonificaciones que afectan al rival.

### Propósito
Proporcionar una experiencia rápida y divertida enfocada en la competencia entre dos jugadores.

### Público objetivo
- **Edad**: 13-35 años.
- **Jugadores**: Ocasionales y competitivos que disfrutan de juegos multijugador rápidos y dinámicos.
- **Plataforma**: PC.

### Estilo visual
El juego tiene un estilo visual **pixel art** con una estética retro y moderna, inspirado en juegos como *Hotline Miami*.

## Mecánicas de juego

### Estructura general
- **Duración de la partida**: 3 rondas, de 2 minutos cada una.
- **Roles asimétricos**: Los jugadores intercambian roles entre rondas.

### Mecánicas de movimientos y habilidades
- **Policía**: Menos veloz, recoge objetos para perjudicar al ladrón.
- **Ladrón**: Más rápido, puede manipular trampas y obstáculos.

### Mecánicas de escenario
Escenarios 2D con plataformas estáticas, rutas y obstáculos interactivos como trampas y alcantarillas.

### Bonificaciones y potenciadores
El policía puede recoger bonificaciones que aparecen cada 15 segundos, como:
- **Aumento de velocidad**
- **Capa de invisibilidad**
- **Red de caza**

### Flujo de juego
Los jugadores eligen el modo de juego (Local o En Línea), se conectan y asignan roles. El objetivo es simple: el policía persigue y el ladrón evade.

### Controles

#### Modo local:
- **Ladrón**: 
  - A: Izquierda
  - D: Derecha
  - W: Saltar
  - S: Deslizarse/Agacharse/Bajar plataforma
  - Espacio: Activar trampa

- **Policía**:
  - J: Izquierda
  - L: Derecha
  - W: Saltar
  - Shift derecho: Activar bonificación

#### Modo en red:
- **Ladrón** y **Policía** comparten los controles: A/D para moverse, W para saltar. El ladrón activa trampas con S y el policía las bonificaciones con Espacio.

## Interfaz

### Diagrama de estados
La navegación entre pantallas sigue el siguiente flujo: Menú principal → Selección de roles → Partida → Resultados ronda → Pantalla de victoria/derrota.

### Pantallas del juego
- **Menú principal**: Opciones básicas como Jugar, Opciones y Salir.
- **Selección de roles**: Los jugadores son asignados aleatoriamente como policía o ladrón.
- **Partida**: Los jugadores controlan sus personajes y se inicia la cuenta atrás.
- **Pantalla de victoria/derrota**: Muestra el resultado final de la partida.

## Arte

### Arte 2D
Estilo **pixel art** con colores neón. Los personajes serán animales antropomorfos: 
- **Policía**: Cerdo con apariencia de oficial de baja forma física.
- **Ladrón**: Gato ágil con aspecto de bandido.

### Audio
La música será **synthwave 8-bit**, con efectos de sonido retro que complementan la estética del juego. Sonidos especiales indicarán el tiempo restante en las partidas para aumentar la tensión.

