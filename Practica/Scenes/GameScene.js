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
    }

    create() {
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
        this.objectRed = this.physics.add.staticImage(1200, 800, 'red'); //red estática
        this.objectRosquilla = this.physics.add.staticImage(450, 800, 'rosquilla'); //rosquilla estatica
        this.ObjectTrampa = this.physics.add.staticImage(1000, 400, 'cepo'); // Cepo estático
        this.ObjectReloj = this.physics.add.staticImage(1500, 800,'reloj'); //Reloj estático
        this.objectSuelo = this.physics.add.staticImage(500, 900, 'Suelo');  // Suelo estático
        this.objectSuelo2 = this.physics.add.staticImage(1400, 900, 'Suelo');  // Suelo estático
        this.objectPared = this.physics.add.staticImage(1000, 900, 'Pared');  // Pared estática

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

        // Colisiones entre el policía y el objeto red
        this.physics.add.collider(this.playerPolicia, this.objectRed, () => {
            this.LadronMovement = false;
            this.objectRed.destroy();
            this.time.delayedCall(2000, () => {
                this.LadronMovement = true;
            });
        });

        // Colisiones entre el policía y el objeto rosquilla
        this.physics.add.collider(this.playerPolicia, this.objectRosquilla, () => {
            this.PoliciaVelocity *= 2;  // Multiplicar la velocidad por 2
            this.objectRosquilla.destroy();  // Destruir la rosquilla
            this.time.delayedCall(3000, () => {  // Después de 5 segundos
                this.PoliciaVelocity /= 2;  // Volver la velocidad a su valor original
            });
        });

        // Colisiones entre el policía y el objeto trampa
        this.physics.add.collider(this.playerPolicia, this.ObjectTrampa, () => {
            this.LadronVelocity /= 2;  // Reducir la velocidad del ladron a la mitad
            this.ObjectTrampa.destroy();  // Destruir la trampa
            this.time.delayedCall(3000, () => {  // Después de 3 segundos
                this.LadronVelocity *= 2;  // Volver la velocidad a su valor original
            });
        });

        // Colisiones entre el policía y el reloj
        this.physics.add.collider(this.playerPolicia, this.ObjectReloj, () => {
            this.timeLeft += 20;  // Añadir 15 segundos al temporizador
            this.timerText.setText(this.formatTime(this.timeLeft)); // Actualizar el texto del temporizador
            this.ObjectReloj.destroy();  // Destruir el objeto reloj después de la colisión
        });

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
