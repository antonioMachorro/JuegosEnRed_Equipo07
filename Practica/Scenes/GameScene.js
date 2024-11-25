class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        if (this.registry.get('player1Rounds') === undefined) {
            this.registry.set('player1Rounds', 0);
        }
        if (this.registry.get('player2Rounds') === undefined) {
            this.registry.set('player2Rounds', 0);
        }

        if(this.registry.get('player1IsPolice') === undefined) {
            this.registry.set('player1IsPolice', data.player1IsPolice);
        }

        this.collisionDetected = false;
    }

    preload() {
        this.load.image('policia', './Personajes/police.png');
        this.load.image('ladron', './Personajes/ladron.png');
        this.load.image('red', './Objetos/red.png');
        this.load.image('rosquilla', './Objetos/rosquilla.png');
        this.load.image('cepo', './Objetos/cepo.png');
        this.load.image('reloj', './Objetos/reloj.png');
        this.load.image('background', 'path/to/background.png');
        this.load.image('Suelo', './Objetos/suelo.png');
        this.load.image('Pared', './Objetos/Pared.png')
        this.load.image('Modificador', './Objetos/modificadores.png');
        this.load.image('icono','./Objectos/icono.png');
        this.load.image('trampilla', './Objetos/trampilla.png');
        this.load.image('cajaItems','./Objetos/cajaItems.png');
        this.load.image('escenario', './Objetos/escenario.png');
        this.load.image('openDoor', './Objetos/openDoor.png');
        this.load.image('closedDoor', './Objetos/closeddoor.png');
    }

    create() {

        const { width, height } = this.scale;

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

        //Variable de puerta
        this.aDoorIsClosed = false;

        // Agregar los personajes con físicas
        this.playerPolicia = this.physics.add.sprite(10, 10, 'policia');
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
        this.ground = this.physics.add.staticGroup();

        this.ground.create(500, 900, 'Suelo');
        this.ground.create(1400, 900, 'Suelo');
        this.ground.create(1800, 650, 'Suelo');
        this.ground.create(1000, 900, 'Pared');

        this.ObjectCajaItems = this.add.image(1750, 100, 'cajaItems'); // Inventario del policia
        this.objectIcono = this.add.image(1750, 100,'icono');
        this.ObjectTrampilla1 = this.physics.add.staticImage(300, 800, 'trampilla');
        this.ObjectTrampilla2 = this.physics.add.staticImage(1200, 800, 'trampilla');

        this.objectOpenDoor = this.physics.add.staticImage(1400, 780, 'openDoor').setScale(0.05);
        this.objectOpenDoor.refreshBody();
        this.objectOpenDoor.body.setSize(this.objectOpenDoor.width * 0.05 * 1.5, this.objectOpenDoor.height * 0.05);
        this.objectOpenDoor.body.setOffset(-((this.objectOpenDoor.width * 0.05 * 1.5) - this.objectOpenDoor.width * 0.05) / 2, 0);

        this.objectClosedDoor = this.physics.add.staticImage(1400, 780, 'closedDoor').setScale(0.13);
        this.objectClosedDoor.refreshBody();
        this.objectClosedDoor.body.setSize(this.objectClosedDoor.width * 0.13 * 0.3, this.objectClosedDoor.height * 0.13);
        this.objectClosedDoor.body.setOffset(((this.objectClosedDoor.width * 0.13) - this.objectClosedDoor.width * 0.13 * 0.3) / 2, 0);

        this.objectClosedDoor.setVisible(false);
        this.objectClosedDoor.body.enable = false;
       

        // Lógica de control del ladrón
        this.LadronMovement = true;
        this.PoliciaVelocity = 350;
        this.LadronVelocity = 500;

        // Colisiones entre los personajes y el suelo
        this.physics.add.collider(this.playerPolicia, this.ground, this.handleBlockCollisionPolicia, null, this);
        this.physics.add.collider(this.playerLadron, this.ground, this.handleBlockCollisionLadron, null, this);

        this.physics.add.collider(this.playerPolicia, this.objectClosedDoor);
        this.physics.add.collider(this.playerLadron, this.objectClosedDoor);

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
        if(this.registry.get('player1IsPolice')){
            this.policeControls = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
            this.thiefControls = this.input.keyboard.createCursorKeys();
            this.thiefInteract = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        } else {
            this.policeControls = this.input.keyboard.createCursorKeys();
            this.thiefControls = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
        }

        //Cierre de puertas
        this.physics.add.overlap(this.playerLadron, this.objectOpenDoor, () => {
            if(this.thiefInteract.isDown && !this.aDoorIsClosed){
                console.log("Crossed a door");
                //Here objectOpenDoor is temporarily disabled.

                this.objectOpenDoor.setVisible(false);
                this.objectOpenDoor.body.enable = false;

                this.objectClosedDoor.setVisible(true);
                this.objectClosedDoor.body.enable = true;

                this.aDoorIsClosed = true;

                this.time.delayedCall(10000, () => {
                    this.objectOpenDoor.setVisible(true);
                    this.objectOpenDoor.body.enable = true;

                    this.objectClosedDoor.setVisible(false);
                    this.objectClosedDoor.body.enable = false;

                    this.aDoorIsClosed = false;
                })
            }
        })

        //this.cursors = this.input.keyboard.createCursorKeys();  // Para el policía (flecha arriba)
        //this.wasd = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });  // Para el ladrón (W)

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

        this.isWallSlideJumpingPolicia = false;
        this.isWallSlideJumpingLadron = false;

        this.wallSlideJumpPositionPolicia = 0;
        this.wallSlideJumpPositionLadron = 0;

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

        this.add.text(width/4, 50, `Jugador 1: ${this.registry.get('player1Rounds')}`, {fontSize: '32px', fill:'#ffff'}).setOrigin(0.5);
        this.add.text(width - width/4, 50, `Jugador 2: ${this.registry.get('player2Rounds')}`, {fontSize: '32px', fill:'#ffff'}).setOrigin(0.5);

        this.input.keyboard.on('keydown-ESC', () =>{
            this.scene.launch('PauseScene');
            this.scene.pause();
        })
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
        // Establecer la velocidad en X a cero antes de procesar el movimiento si no está en el salto de pared.
        if(!this.isWallSlideJumpingPolicia){
            this.playerPolicia.setVelocityX(0);
        } else {
            if(this.playerPolicia.body.x === this.wallSlideJumpPositionPolicia)
            {
                this.isWallSlideJumpingPolicia = false;
            }
        }

        if(!this.isWallSlideJumpingLadron){
            this.playerLadron.setVelocityX(0);
        } else {
            if(this.playerLadron.body.x === this.wallSlideJumpPositionLadron)
            {
                this.isWallSlideJumpingLadron = false;
            }
        }

        // Movimiento del policía con las flechas
        if(!this.isWallSlideJumpingPolicia)
        {
            if (this.policeControls.left.isDown) {
                this.playerPolicia.setVelocityX(-this.PoliciaVelocity * this.time.timeScale);
            } else if (this.policeControls.right.isDown) {
                this.playerPolicia.setVelocityX(this.PoliciaVelocity * this.time.timeScale);
            }
        }

        // Movimiento del ladrón con las teclas WASD
        if(!this.isWallSlideJumpingLadron) {
            if (this.LadronMovement) {
                if (this.thiefControls.left.isDown) {
                    this.playerLadron.setVelocityX(-this.LadronVelocity * this.time.timeScale);
                } else if (this.thiefControls.right.isDown) {
                    this.playerLadron.setVelocityX(this.LadronVelocity * this.time.timeScale);
                }
            }
        }

        // Detectar si el jugador está pegado a la pared (si está tocando la pared)
        this.checkWallSlide(this.playerPolicia);
        this.checkWallSlide(this.playerLadron);

        // Salto del policía (doble salto)
        if (this.policeControls.up.isDown && this.canJumpPolicia) {
            if (this.isWallSlidingPolicia) {
                // Si está pegado a la pared, salta hacia el lado contrario
                if (this.playerPolicia.body.blocked.left) {
                    this.isWallSlideJumpingPolicia = true;
                    this.wallSlideJumpPositionPolicia = this.playerPolicia.body.x + 30;
                    this.playerPolicia.setVelocityY(-600 * this.time.timeScale);
                    this.playerPolicia.setVelocityX(300 * this.time.timeScale); // Salta hacia la derecha
                } else if (this.playerPolicia.body.blocked.right) {
                    this.isWallSlideJumpingPolicia = true;
                    this.wallSlideJumpPositionPolicia = this.playerPolicia.body.x - 30;
                    this.playerPolicia.setVelocityY(-600 * this.time.timeScale);
                    this.playerPolicia.setVelocityX(-300 * this.time.timeScale); // Salta hacia la izquierda
                }
                this.isWallSlidingPolicia = false;  // Dejar de estar pegado a la pared
            } else if (this.playerPolicia.body.touching.down || this.jumpCountPolicia < this.maxJumpCount) {
                // Si toca el suelo o tiene saltos disponibles, permite el salto
                this.playerPolicia.setVelocityY(-500 * this.time.timeScale);
                this.jumpCountPolicia++;  // Incrementa el contador de saltos
            }
            this.canJumpPolicia = false;  // Desactivar el salto por un tiempo
            this.time.delayedCall(this.jumpCooldown, () => {
                this.canJumpPolicia = true;  // Reactivar el salto después del cooldown
            });
        }

        // Salto del ladrón (doble salto)
        if (this.thiefControls.up.isDown && this.canJumpLadron) {
            if (this.isWallSlidingLadron) {
                // Si está pegado a la pared, salta hacia el lado contrario
                if (this.playerLadron.body.blocked.left) {
                    this.isWallSlideJumpingLadron = true;
                    this.wallSlideJumpPositionLadron = this.playerLadron.body.x + 30;
                    this.playerLadron.setVelocityY(-600 * this.time.timeScale);
                    this.playerLadron.setVelocityX(300 * this.time.timeScale); // Salta hacia la derecha
                } else if (this.playerLadron.body.blocked.right) {
                    this.isWallSlideJumpingLadron = true;
                    this.wallSlideJumpPositionLadron = this.playerLadron.body.x - 30;
                    this.playerLadron.setVelocityY(-600 * this.time.timeScale);
                    this.playerLadron.setVelocityX(-300 * this.time.timeScale); // Salta hacia la izquierda
                }
                this.isWallSlidingLadron = false;  // Dejar de estar pegado a la pared
            } else if (this.playerLadron.body.touching.down || this.jumpCountLadron < this.maxJumpCount) {
                // Si toca el suelo o tiene saltos disponibles, permite el salto
                this.playerLadron.setVelocityY(-500 * this.time.timeScale);
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

            let player1IsPolice = this.registry.get('player1IsPolice');
            this.registry.set('player1IsPolice', !player1IsPolice)

            if(player1IsPolice)
            {
                const player2Rounds = this.registry.get('player2Rounds') + 1;
                this.registry.set('player2Rounds', player2Rounds);

                if(player2Rounds >= 3)
                {
                    this.scene.start('VictoryScene', {winner: 'Jugador 2'});
                    this.registry.set('player1Rounds', 0)
                    this.registry.set('player2Rounds', 0);
                } else {
                    this.playRoundWin('Ladrón');
                }
            } else {
                const player1Rounds = this.registry.get('player1Rounds') + 1;
                this.registry.set('player1Rounds', player1Rounds);

                if(player1Rounds >= 3)
                {
                    this.scene.start('VictoryScene', {winner: 'Jugador 1'});
                    this.registry.set('player1Rounds', 0)
                    this.registry.set('player2Rounds', 0);
                } else {
                    this.playRoundWin('Ladrón');
                }
            }
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const partInSeconds = seconds % 60;
        return `${minutes}:${partInSeconds.toString().padStart(2, '0')}`;
    }

    handleBlockCollisionPolicia(player, block){
        const playerBottom = player.body.bottom;
        const playerLeft = player.body.left;
        const playerRight = player.body.right;

        const blockTop = block.body.top;
        const blockLeft = block.body.left;
        const blockRight = block.body.right;

        if(playerBottom <= blockTop + 5) {
            this.resetJumpPolicia();
        }
        else if(playerRight >= blockLeft && player.body.touching.right) {
            this.handleWallCollisionPolicia();
        } else if(playerLeft <= blockRight && player.body.touching.left) {
            this.handleWallCollisionPolicia();
        }
    }

    handleBlockCollisionLadron(player, block){
        const playerBottom = player.body.bottom;
        const playerLeft = player.body.left;
        const playerRight = player.body.right;

        const blockTop = block.body.top;
        const blockLeft = block.body.left;
        const blockRight = block.body.right;

        if(playerBottom <= blockTop + 5) {
            this.resetJumpLadron();
        }
        else if(playerRight >= blockLeft && player.body.touching.right) {
            this.handleWallCollisionLadron();
        } else if(playerLeft <= blockRight && player.body.touching.left) {
            this.handleWallCollisionLadron();
        }
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
            this.jumpCountPolicia = 1;
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
            this.jumpCountLadron = 1;
        } else {
            this.isWallSlidingLadron = false;  // Terminar el tiempo pegado
        }
    }

    teleportLadron(targetTrampilla) {
        // Cambiar las coordenadas del ladrón a las de la trampilla de destino
        this.playerLadron.setX(targetTrampilla.x);
        this.playerLadron.setY(targetTrampilla.y);
    
        // Añadir un pequeño salto hacia arriba
        this.playerLadron.setVelocityY(-300 * this.time.timeScale);  // Valor negativo para saltar hacia arriba
    
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
        if(this.collisionDetected) return;

        console.log('¡Colisión entre Policía y Ladrón!');
        this.collisionDetected = true;
        
        let player1IsPolice = this.registry.get('player1IsPolice');
        this.registry.set('player1IsPolice', !player1IsPolice)

        // Aquí puedes poner lo que deseas hacer cuando los personajes colisionan (por ejemplo, reiniciar el juego o cambiar de escena)
        if(player1IsPolice)
        {
            const player1Rounds = this.registry.get('player1Rounds') + 1;
            this.registry.set('player1Rounds', player1Rounds);

            if(player1Rounds >= 3)
            {
                this.scene.start('VictoryScene', {winner: 'Jugador 1'});
                this.registry.set('player1Rounds', 0);
                this.registry.set('player2Rounds', 0);
            } else {
                this.playRoundWin('Policia');
            }
        } else {
            const player2Rounds = this.registry.get('player2Rounds') + 1;
            this.registry.set('player2Rounds', player2Rounds);

            if(player2Rounds >= 3)
            {
                this.scene.start('VictoryScene', {winner: 'Jugador 2'});
                this.registry.set('player1Rounds', 0);
                this.registry.set('player2Rounds', 0);
            } else {
                this.playRoundWin('Policia');
            }
        }
    }

    playRoundWin(winner)
    {
        this.time.timeScale = 0.1;
        //this.input.keyboard.enabled = false;

        const winnerText = this.add.text(this.centerX, this.cameras.main.height / 2,
            `${winner} Wins This Round!`,
            {
                font: '80px Arial',
                fill: '#fff',
                backgroundColor: '#000'
            }).setOrigin(0.5);

        winnerText.setDepth(9999);

        const fadeDuration = 300;
        //this.cameras.main.fadeOut(fadeDuration, 0, 0, 0);

        this.time.delayedCall(fadeDuration, () => {
            this.time.timeScale = 1;
            //this.cameras.main.fadeIn(0);
            this.scene.restart();
            this.input.keyboard.enabled = true;
        })
    }
}

export default GameScene;
