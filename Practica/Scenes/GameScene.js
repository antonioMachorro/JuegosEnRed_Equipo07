class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('policia', '/Personajes/police.png');
        this.load.image('ladron', '/Personajes/ladron.png');
        this.load.image('red', '/Objetos/red.png');
        this.load.image('rosquilla', '/Objetos/rosquilla.png');
        this.load.image('cepo', '/Objetos/cepo.png');
        this.load.image('reloj', '/Objetos/reloj.png');
        this.load.image('background', 'path/to/background.png');
        this.load.image('Suelo', '/Objetos/suelo.png');
        this.load.image('Pared', '/Objetos/Pared.png')
        this.load.image('Modificador', '/Objetos/modificadores.png');
        this.load.image('icono','/Objectos/icono.png');
        this.load.image('trampilla', '/Objetos/trampilla.png');
        this.load.image('cajaItems','/Objetos/cajaItems.png');
    }

    create() {

        this.items = {
            red:{
                nombre: "red",
                imagen: "red"
            },

            cepo:{
                nombre: "cepo",
                imagen:"cepo"
            },
            reloj:{
                nombre: "reloj",
                imagen:"reloj"
            },
            rosquilla:{
                nombre: "rosquilla",
                imagen:"rosquilla"
            },
        }

        // Variable de trampilla
        this.canUseTrampilla = true;

        // Agregar los personajes con físicas
        this.playerPolicia = this.physics.add.sprite(100, 300, 'policia');
        this.playerLadron = this.physics.add.sprite(800, 300, 'ladron');

        // Ajustar el collider de los personajes
        this.playerPolicia.body.setSize(40, 85);  // Collider del policía
        this.playerLadron.body.setSize(40, 85);    // Collider del ladrón

        // Configurar el temporizador inicial de 2 minutos (120 segundos)
        this.timeLeft = 120;

         // Crear el texto del temporizador, centrado en el eje X y en la parte superior de la pantalla
         this.centerX = this.cameras.main.width / 2;
         this.timerText = this.add.text(this.centerX, 60, this.formatTime(this.timeLeft), {
             font: '80px Arial',
             fill: '#fff'
         }).setOrigin(0.5, 0);  // Centrar en X y poner en la parte superior

         // Configurar evento de tiempo que reduce el contador cada segundo
        this.timerEvent = this.time.addEvent({
            delay: 1000,  // Cada segundo
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Agregar objetos y suelo
        this.objectSuelo = this.physics.add.staticImage(500, 900, 'Suelo');  // Suelo estático
        this.objectSuelo2 = this.physics.add.staticImage(1400, 900, 'Suelo');  // Suelo estático
        this.objectPared = this.physics.add.staticImage(1000, 900, 'Pared');  // Pared estática
        this.ObjectCajaItems = this.add.image(1750, 100, 'cajaItems'); // Inventario del policia
        this.objectIcono = this.add.image(1750, 100,'icono');
        this.ObjectTrampilla1 = this.physics.add.staticImage(300, 800, 'trampilla');
        this.ObjectTrampilla2 = this.physics.add.staticImage(1200, 800, 'trampilla');
       

        // Lógica de control del ladrón
        this.LadronMovement = true;
        this.PoliciaVelocity = 350;
        this.LadronVelocity = 500;

        // Colisiones entre los personajes y el suelo
        this.physics.add.collider(this.playerPolicia, this.objectSuelo, this.resetJumpPolicia, null, this);
        this.physics.add.collider(this.playerLadron, this.objectSuelo2, this.resetJumpLadron, null, this);
        this.physics.add.collider(this.playerPolicia, this.objectSuelo2, this.resetJumpPolicia, null, this);
        this.physics.add.collider(this.playerLadron, this.objectSuelo, this.resetJumpLadron, null, this);
        this.physics.add.collider(this.playerPolicia, this.objectPared, this.handleWallCollisionPolicia, null, this);
        this.physics.add.collider(this.playerLadron, this.objectPared, this.handleWallCollisionLadron, null, this);

        // Colisiones entre el ladrón y las trampillas
        this.physics.add.overlap(this.playerLadron, this.ObjectTrampilla1, () => {
            if (this.canUseTrampilla) {
                this.teleportLadron(this.ObjectTrampilla2); // Teletransporta al ladrón a la trampilla 2
                this.startTrampillaCooldown(); // Activar el cooldown
            }
        }, null, this);
        
        this.physics.add.overlap(this.playerLadron, this.ObjectTrampilla2, () => {
            if (this.canUseTrampilla) {
                this.teleportLadron(this.ObjectTrampilla1); // Teletransporta al ladrón a la trampilla 1
                this.startTrampillaCooldown(); // Activar el cooldown
            }
        }, null, this);

        // Controles del jugador (policía y ladrón)
        this.cursors = this.input.keyboard.createCursorKeys();  // Para el policía (flecha arriba)
        this.wasd = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });  // Para el ladrón (W)

        // Variables para manejar el doble salto
        this.jumpCountPolicia = 0;  // Contador de saltos del policía
        this.jumpCountLadron = 0;   // Contador de saltos del ladrón
        this.maxJumpCount = 2;      // Número máximo de saltos (doble salto)

        // Variables para el control del pegado a la pared
        this.isWallSlidingPolicia = false;
        this.isWallSlidingLadron = false;
        this.wallSlideTimePolicia = 0;
        this.wallSlideTimeLadron = 0;
        this.wallSlideDuration = 5000;  // Duración de la "pegada" a la pared en milisegundos

        // Asegurarse de que los jugadores no caigan fuera de los límites
        this.playerPolicia.setCollideWorldBounds(true);
        this.playerLadron.setCollideWorldBounds(true);

        // Variables de control de tiempo para evitar múltiples saltos por tick
        this.canJumpPolicia = true;
        this.canJumpLadron = true;
        this.jumpCooldown = 250;  // Tiempo entre saltos en milisegundos

        // Colisión entre los jugadores (policía y ladrón)
        this.physics.add.collider(this.playerPolicia, this.playerLadron, this.onCollision, null, this);

        // Pool de objetos y coordenadas
        this.objectPool = ['reloj', 'rosquilla', 'red', 'cepo'];
        this.positionPool = [
            { x: 500, y: 800 },
            { x: 1300, y: 800 }
        ];
  
        // Inventario del policia (vacio inicialmente)
        this.policiaInventory = null;
        this.objectIcono.setTexture(this.objectIcono.image);

        // Generar un objeto Modificador en una posición aleatoria
        this.spawnRandomModifier();

        // Detectar cuando se presione la tecla Enter
        this.input.keyboard.on('keydown-ENTER', (event) => {
            this.useModifier();
            
        });
    }

    spawnRandomModifier() {
        // Seleccionar una posición aleatoria de la pool
        //const randomPos = Phaser.Utils.Array.RemoveRandomElement(this.positionPool);
        if(this.policiaInventory == null){

        const randomPos = this.positionPool[Math.floor(Math.random() * this.positionPool.length)];

        // Crear un sprite en esa posición con la imagen de 'Modificador'
        this.currentModifier = this.physics.add.staticImage(randomPos.x, randomPos.y, 'Modificador');

        // Añadir colisión con el policía para recoger el modificador
        this.physics.add.overlap(this.playerPolicia, this.currentModifier, this.collectModifier, null, this);
        }
    }

    collectModifier() {
        // Seleccionar un modificador aleatorio de la pool
        const randomModifier = Phaser.Utils.Array.GetRandom(this.objectPool);
        const key = this.items[randomModifier];
        this.policiaInventory = randomModifier;

        // Actualizar el texto de inventario en pantalla
        //this.inventoryText.setText('Inventario: ' + randomModifier);
        this.objectIcono.setTexture(key.imagen);
        

        // Eliminar el sprite del modificador del juego
        this.currentModifier.destroy();
    }

    useModifier() {
        if (!this.policiaInventory) return;

        // Aplicar el efecto del modificador actual
        switch (this.policiaInventory) {
            case 'reloj':
                this.timeLeft += 20;
                this.timerText.setText(this.formatTime(this.timeLeft));
                break;
            case 'rosquilla':
                this.PoliciaVelocity *= 2;
                this.time.delayedCall(3000, () => {
                    this.PoliciaVelocity /= 2;
                });
                break;
            case 'red':
                this.LadronMovement = false;
                this.time.delayedCall(2000, () => {
                    this.LadronMovement = true;
                });
                break;
            case 'cepo':
                this.LadronVelocity /= 2;
                this.time.delayedCall(3000, () => {
                    this.LadronVelocity *= 2;
                });
                break;
        }

        // Limpiar el inventario después de usar el modificador
        this.policiaInventory = null;
        this.objectIcono.setTexture(this.objectIcono.image);

        // Generar un nuevo modificador después de usarlo
        setTimeout(() => {
            this.spawnRandomModifier()
        }, 3000)
        
    }

    update(time, delta) {
        // Establecer la velocidad en X a cero antes de procesar el movimiento
        this.playerPolicia.setVelocityX(0);
        this.playerLadron.setVelocityX(0);

        // Movimiento del policía con las flechas
        if (this.cursors.left.isDown) {
            this.playerPolicia.setVelocityX(-this.PoliciaVelocity);
        } else if (this.cursors.right.isDown) {
            this.playerPolicia.setVelocityX(this.PoliciaVelocity);
        }

        // Movimiento del ladrón con las teclas WASD
        if (this.LadronMovement) {
            if (this.wasd.left.isDown) {
                this.playerLadron.setVelocityX(-this.LadronVelocity);
            } else if (this.wasd.right.isDown) {
                this.playerLadron.setVelocityX(this.LadronVelocity);
            }
        }

        // Detectar si el jugador está pegado a la pared (si está tocando la pared)
        this.checkWallSlide(this.playerPolicia);
        this.checkWallSlide(this.playerLadron);

        // Salto del policía (doble salto)
        if (this.cursors.up.isDown && this.canJumpPolicia) {
            if (this.isWallSlidingPolicia) {
                // Si está pegado a la pared, salta hacia el lado contrario
                if (this.playerPolicia.body.blocked.left) {
                    this.playerPolicia.setVelocityY(-500);
                    this.playerPolicia.setVelocityX(2000); // Salta hacia la derecha
                } else if (this.playerPolicia.body.blocked.right) {
                    this.playerPolicia.setVelocityY(-500);
                    this.playerPolicia.setVelocityX(-2000); // Salta hacia la izquierda
                }
                this.isWallSlidingPolicia = false;  // Dejar de estar pegado a la pared
            } else if (this.playerPolicia.body.touching.down || this.jumpCountPolicia < this.maxJumpCount) {
                // Si toca el suelo o tiene saltos disponibles, permite el salto
                this.playerPolicia.setVelocityY(-500);
                this.jumpCountPolicia++;  // Incrementa el contador de saltos
            }
            this.canJumpPolicia = false;  // Desactivar el salto por un tiempo
            this.time.delayedCall(this.jumpCooldown, () => {
                this.canJumpPolicia = true;  // Reactivar el salto después del cooldown
            });
        }

        // Salto del ladrón (doble salto)
        if (this.wasd.up.isDown && this.canJumpLadron) {
            if (this.isWallSlidingLadron) {
                // Si está pegado a la pared, salta hacia el lado contrario
                if (this.playerLadron.body.blocked.left) {
                    this.playerLadron.setVelocityY(-500);
                    this.playerLadron.setVelocityX(2000); // Salta hacia la derecha
                } else if (this.playerLadron.body.blocked.right) {
                    this.playerLadron.setVelocityY(-500);
                    this.playerLadron.setVelocityX(-2000); // Salta hacia la izquierda
                }
                this.isWallSlidingLadron = false;  // Dejar de estar pegado a la pared
            } else if (this.playerLadron.body.touching.down || this.jumpCountLadron < this.maxJumpCount) {
                // Si toca el suelo o tiene saltos disponibles, permite el salto
                this.playerLadron.setVelocityY(-500);
                this.jumpCountLadron++;  // Incrementa el contador de saltos
            }
            this.canJumpLadron = false;  // Desactivar el salto por un tiempo
            this.time.delayedCall(this.jumpCooldown, () => {
                this.canJumpLadron = true;  // Reactivar el salto después del cooldown
            });
        }
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.timerText.setText(this.formatTime(this.timeLeft));
        } else {
            this.timerEvent.remove();
            this.scene.start('ThiefVictoryScene');
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const partInSeconds = seconds % 60;
        return `${minutes}:${partInSeconds.toString().padStart(2, '0')}`;
    }

    // Detectar si el jugador está pegado a la pared
    checkWallSlide(player) {
        if (player.body.blocked.left || player.body.blocked.right) {
            if (player.body.touching.down) {
                // Si está tocando el suelo, no se puede pegar a la pared
                return;
            }
            // El jugador se queda pegado a la pared durante un tiempo
            if (player === this.playerPolicia) {
                this.isWallSlidingPolicia = true;
                this.wallSlideTimePolicia = this.wallSlideDuration;
            } else if (player === this.playerLadron) {
                this.isWallSlidingLadron = true;
                this.wallSlideTimeLadron = this.wallSlideDuration;
            }
        } else {
            // Si no está tocando la pared, se resetea
            if (player === this.playerPolicia) {
                this.isWallSlidingPolicia = false;
            } else if (player === this.playerLadron) {
                this.isWallSlidingLadron = false;
            }
        }
    }

    // Función para manejar la colisión con la pared para el policía
    handleWallCollisionPolicia() {
        if (this.wallSlideTimePolicia > 0) {
            // El policía se queda pegado durante wallSlideDuration
            this.playerPolicia.setVelocityY(0);  // Detener la caída
            this.wallSlideTimePolicia -= 10;  // Reducir el tiempo de pegado (cada tick)
            // Reiniciar contador de saltos cuando colisiona con la pared
            this.jumpCountPolicia = 0;
        } else {
            this.isWallSlidingPolicia = false;  // Terminar el tiempo pegado
        }
    }

    // Función para manejar la colisión con la pared para el ladrón
    handleWallCollisionLadron() {
        if (this.wallSlideTimeLadron > 0) {
            // El ladrón se queda pegado durante wallSlideDuration
            this.playerLadron.setVelocityY(0);  // Detener la caída
            this.wallSlideTimeLadron -= 10;  // Reducir el tiempo de pegado (cada tick)
            // Reiniciar contador de saltos cuando colisiona con la pared
            this.jumpCountLadron = 0;
        } else {
            this.isWallSlidingLadron = false;  // Terminar el tiempo pegado
        }
    }

    teleportLadron(targetTrampilla) {
        // Cambiar las coordenadas del ladrón a las de la trampilla de destino
        this.playerLadron.setX(targetTrampilla.x);
        this.playerLadron.setY(targetTrampilla.y);
    
        // Añadir un pequeño salto hacia arriba
        this.playerLadron.setVelocityY(-300);  // Valor negativo para saltar hacia arriba
    
        // Añadir un efecto visual opcional (como un parpadeo)
        this.playerLadron.alpha = 0.5; // Cambiar temporalmente la opacidad
        this.time.delayedCall(200, () => {
            this.playerLadron.alpha = 1; // Restaurar la opacidad después de 200ms
        });
    }

    startTrampillaCooldown() {
        this.canUseTrampilla = false;
        this.time.delayedCall(1000, () => {
            this.canUseTrampilla = true;
        });
    }

    // Resetear los contadores de saltos cuando los personajes tocan el suelo
    resetJumpPolicia() {
        this.jumpCountPolicia = 0;  // Resetea el contador de saltos cuando toca el suelo
    }

    resetJumpLadron() {
        this.jumpCountLadron = 0;  // Resetea el contador de saltos cuando toca el suelo
    }

    // Función que se llama cuando los jugadores colisionan
    onCollision() {
        console.log('¡Colisión entre Policía y Ladrón!');
        // Aquí puedes poner lo que deseas hacer cuando los personajes colisionan (por ejemplo, reiniciar el juego o cambiar de escena)
        this.scene.start('PoliceVictoryScene');
    }
}

export default GameScene;
