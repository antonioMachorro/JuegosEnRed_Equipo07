class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init(data) {
    if (this.registry.get("player1Rounds") === undefined) {
      this.registry.set("player1Rounds", 0);
    }
    if (this.registry.get("player2Rounds") === undefined) {
      this.registry.set("player2Rounds", 0);
    }

    if (this.registry.get("player1IsPolice") === undefined) {
      this.registry.set("player1IsPolice", data.player1IsPolice);
    }

    this.collisionDetected = false;
  }

  preload() {
    this.load.image("escenario", "./Escenario/Escenario.png");
    this.load.image("red", "./Objetos/red.png");
    this.load.image("rosquilla", "./Objetos/rosquilla.png");
    this.load.image("cepo", "./Objetos/cepo.png");
    this.load.image("reloj", "./Objetos/reloj.png");
    this.load.image("background", "path/to/background.png");
    this.load.image("Suelo", "./Objetos/suelo.png");
    this.load.image("Pared", "./Objetos/Pared.png");
    this.load.image("Modificador", "./Objetos/modificadores.png");
    this.load.image("icono", "./Objectos/icono.png");
    this.load.image("trampilla", "./Objetos/trampilla.png");
    this.load.image("cajaItems", "./Objetos/cajaItems.png");
    this.load.image("escenario", "./Objetos/escenario.png");
    this.load.image("openDoor", "./Objetos/openDoor.png");
    this.load.image("closedDoor", "./Objetos/closeddoor.png");

    this.load.atlas(
      "policia",
      "./Personajes/Policia_Spritesheet.png",
      "./Personajes/policia_spritesheet.json"
    );

    this.load.atlas(
        "ladron",
        "./Personajes/Ladron_Spritesheet.png",
        "./Personajes/ladron_spritesheet.json"
    )

    this.load.audio("game_music", "./Musica/GAMEPLAYYYY.wav");
  }

  create() {
    this.game.audioManager.playMusic("game_music");

    const { width, height } = this.scale;

    this.items = {
      red: {
        nombre: "red",
        imagen: "red",
      },

      cepo: {
        nombre: "cepo",
        imagen: "cepo",
      },
      reloj: {
        nombre: "reloj",
        imagen: "reloj",
      },
      rosquilla: {
        nombre: "rosquilla",
        imagen: "rosquilla",
      },
    };

    // Controles del jugador (policía y ladrón)
    if (this.registry.get("player1IsPolice")) {
      this.policeControls = this.input.keyboard.addKeys({
        up: "W",
        left: "A",
        down: "S",
        right: "D",
      });
      this.policeInteract = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      this.thiefControls = this.input.keyboard.createCursorKeys();
      this.thiefInteract = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      );
    } else {
      this.policeControls = this.input.keyboard.createCursorKeys();
      this.policeInteract = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SHIFT
      );
      this.thiefControls = this.input.keyboard.addKeys({
        up: "W",
        left: "A",
        down: "S",
        right: "D",
      });
      this.thiefInteract = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
    }

    this.policiaFacingRight = true;
    this.ladronFacingRight = true;

    // Variable de trampilla
    this.canUseTrampilla = true;
    this.canUseTrampilla1 = true;
    this.canUseTrampilla2 = true;

    //Variable de puerta
    this.aDoorIsClosed = false;

    // Agregar objetos y suelo
    this.ground = this.physics.add.staticGroup();

    this.ground.create(960, 540, "escenario").setDepth(-1);
    // this.ground.create(500, 900, 'Suelo');
    //this.ground.create(1400, 900, 'Suelo');
    //this.ground.create(1800, 650, 'Suelo');
    //this.ground.create(1000, 900, 'Pared');

    // Agregar los personajes con físicas
    this.playerPolicia = this.physics.add.sprite(1215, 705, "policia");
    this.playerLadron = this.physics.add.sprite(740, 580, "ladron");

    // Ajustar el collider de los personajes
    this.playerPolicia.body.setSize(20, 35); // Collider del policía
    this.playerLadron.body.setSize(20, 35); // Collider del ladrón

    this.playerPolicia.on('animationupdate', () => {
        this.playerPolicia.body.setSize(25, 35);
    });

    // Configurar el temporizador inicial de 2 minutos (120 segundos)
    this.timeLeft = 120;

    // Ajustar la cámara
    const camera = this.cameras.main;
    camera.setBounds(370, 210, 960, 540);
    camera.setZoom(2.6);

    // Crear el texto del temporizador en las coordenadas 1600, 300
    this.centerX = 960;
    this.centerY = 342; 

    this.timerText = this.add
      .text(this.centerX, this.centerY, this.formatTime(this.timeLeft), {
        fontFamily: "retro-computer",
        fontSize: "18px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0); // Centrar en X, mantener en la parte superior

    // Configurar evento de tiempo que reduce el contador cada segundo
    this.timerEvent = this.time.addEvent({
      delay: 1000, // Cada segundo
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    const busColl = this.physics.add
      .staticImage(920, 550)
      .setSize(90, 110)
      .setVisible(false);

    const sueloCasaColl = this.physics.add
      .staticImage(855, 613)
      .setSize(360, 21)
      .setVisible(false);

    const marcoSupColl = this.physics.add
      .staticImage(960, 337)
      .setSize(960, 5)
      .setVisible(false);

    const marcoInfColl = this.physics.add
      .staticImage(960, 742)
      .setSize(960, 8)
      .setVisible(false);

    const marcoDerColl = this.physics.add
      .staticImage(1303, 337)
      .setSize(5, 960)
      .setVisible(false);

    const marcoIzqColl = this.physics.add
      .staticImage(618, 337)
      .setSize(5, 960)
      .setVisible(false);

    const sueloSub1Coll = this.physics.add
      .staticImage(872, 677)
      .setSize(385, 16)
      .setVisible(false);

    const sueloSub2Coll = this.physics.add
      .staticImage(850, 680)
      .setSize(30, 16)
      .setVisible(false);

    const sueloSub3Coll = this.physics.add
      .staticImage(690, 685)
      .setSize(21, 16)
      .setVisible(false);

    const sueloSub1CollMont1 = this.physics.add
      .staticImage(1030, 690)
      .setSize(40, 16)
      .setVisible(false);

    const sueloSub1CollMont2 = this.physics.add
      .staticImage(1135, 728)
      .setSize(17, 40)
      .setVisible(false);

    const sueloSub1CollMont3 = this.physics.add
      .staticImage(1220, 738)
      .setSize(160, 20)
      .setVisible(false);

    const sueloSubMont1 = this.physics.add
      .staticImage(760, 738)
      .setSize(39, 20)
      .setVisible(false);

    const sueloSubMont2 = this.physics.add
      .staticImage(928, 738)
      .setSize(30, 10)
      .setVisible(false);

    const sueloSubMont3 = this.physics.add
      .staticImage(1216, 672)
      .setSize(40, 18)
      .setVisible(false);

    const paredSub = this.physics.add
      .staticImage(1300, 690)
      .setSize(30, 90)
      .setVisible(false);

    const paredSub2 = this.physics.add
      .staticImage(1300, 640)
      .setSize(15, 1200)
      .setVisible(false);

    const sueloTubInf1 = this.physics.add
      .staticImage(1168, 604)
      .setSize(155, 17)
      .setVisible(false);

    const sueloTubInf2 = this.physics.add
      .staticImage(1119, 615)
      .setSize(57, 17)
      .setVisible(false);

    const sueloTubInf3 = this.physics.add
      .staticImage(1135, 628)
      .setSize(23, 65)
      .setVisible(false);

    const sueloSupTub = this.physics.add
      .staticImage(1175, 421)
      .setSize(110, 20)
      .setVisible(false);

    const sueloviga = this.physics.add
      .staticImage(1163, 500)
      .setSize(133, 20)
      .setVisible(false);

    const sueloviga2 = this.physics.add
      .staticImage(982, 433)
      .setSize(125, 25)
      .setVisible(false);

    const techoCasaColl = this.physics.add
      .staticImage(735, 380)
      .setSize(130, 10)
      .setVisible(false);

    const paredCasaColl = this.physics.add
      .staticImage(673, 392)
      .setSize(7, 20)
      .setVisible(false);

    const techoCasa1 = this.physics.add
      .staticImage(735, 380)
      .setSize(130, 9)
      .setVisible(false);

    const paredCasa1_1 = this.physics.add
      .staticImage(673, 392)
      .setSize(7, 20)
      .setVisible(false);

    const paredCasa1_2 = this.physics.add
      .staticImage(796, 392)
      .setSize(7, 20)
      .setVisible(false);

    const techoCasa2 = this.physics.add
      .staticImage(735, 463)
      .setSize(130, 9)
      .setVisible(false);

    const paredCasa2_1 = this.physics.add
      .staticImage(673, 475)
      .setSize(7, 20)
      .setVisible(false);

    const paredCasa2_2 = this.physics.add
      .staticImage(796, 475)
      .setSize(7, 20)
      .setVisible(false);

    const techoCasa3 = this.physics.add
      .staticImage(735, 540)
      .setSize(130, 9)
      .setVisible(false);

    const paredCasa3_1 = this.physics.add
      .staticImage(673, 552)
      .setSize(7, 20)
      .setVisible(false);

    const paredCasa3_2 = this.physics.add
      .staticImage(796, 552)
      .setSize(7, 20)
      .setVisible(false);

    const balcon = this.physics.add
      .staticImage(820, 462)
      .setSize(45, 7)
      .setVisible(false);

    const paredMorada1 = this.physics.add
      .staticImage(1238, 411)
      .setSize(16, 42)
      .setVisible(false);

    const paredMorada2 = this.physics.add
      .staticImage(1238, 543)
      .setSize(16, 108)
      .setVisible(false);

    const barra = this.physics.add
      .staticImage(1025, 595)
      .setSize(17, 20)
      .setVisible(false);

    const cuboBarra = this.physics.add
      .staticImage(1028, 547)
      .setSize(3, 108)
      .setVisible(false);

    this.ground.add(busColl);
    this.ground.add(sueloCasaColl);
    this.ground.add(marcoSupColl);
    this.ground.add(marcoDerColl);
    this.ground.add(marcoIzqColl);
    this.ground.add(marcoInfColl);
    this.ground.add(sueloSub1Coll);
    this.ground.add(sueloSub2Coll);
    this.ground.add(sueloSub3Coll);
    this.ground.add(sueloTubInf1);
    this.ground.add(sueloTubInf2);
    this.ground.add(sueloTubInf3);
    this.ground.add(sueloSupTub);
    this.ground.add(sueloviga);
    this.ground.add(sueloSubMont1);
    this.ground.add(sueloSubMont2);
    this.ground.add(sueloSubMont3);
    this.ground.add(sueloviga2);
    this.ground.add(techoCasaColl);
    this.ground.add(paredCasaColl);
    this.ground.add(sueloSub1CollMont1);
    this.ground.add(sueloSub1CollMont2);
    this.ground.add(sueloSub1CollMont3);
    this.ground.add(techoCasa1);
    this.ground.add(techoCasa2);
    this.ground.add(techoCasa3);
    this.ground.add(paredCasa1_1);
    this.ground.add(paredCasa1_2);
    this.ground.add(paredCasa2_1);
    this.ground.add(paredCasa2_2);
    this.ground.add(paredCasa3_1);
    this.ground.add(paredCasa3_2);
    this.ground.add(balcon);
    this.ground.add(paredMorada1);
    this.ground.add(paredMorada2);
    this.ground.add(paredSub);
    this.ground.add(paredSub2);
    this.ground.add(barra);
    this.ground.add(cuboBarra);

    //this.ObjectCajaItems = this.add.image(1200, 350, "cajaItems"); // Inventario del policia
    this.registry.get('player1IsPolice') ? this.objectIcono = this.add.image(710, 350, "icono") : this.objectIcono = this.add.image(1210, 350, "icono");
    console.log(this.registry.get('player1IsPolice'));
    console.log(this.objectIcono.x);
    this.ObjectTrampilla1 = this.physics.add.staticImage(1203, 395, "trampilla");
    this.ObjectTrampilla2 = this.physics.add.staticImage(1203, 580, "trampilla");
    this.ObjectTrampilla3 = this.physics.add.staticImage(995, 580, "trampilla");
    this.ObjectTrampilla4 = this.physics.add.staticImage(840, 580, "trampilla");
    this.ObjectVentilacion1 = this.physics.add.staticImage(730, 510, "trampilla");
    this.ObjectVentilacion2 = this.physics.add.staticImage(730, 420, "trampilla");

    this.objectOpenDoor = this.physics.add
      .staticImage(1400, 780, "openDoor")
      .setScale(0.05);
    this.objectOpenDoor.refreshBody();
    this.objectOpenDoor.body.setSize(
      this.objectOpenDoor.width * 0.05 * 1.5,
      this.objectOpenDoor.height * 0.05
    );
    this.objectOpenDoor.body.setOffset(
      -(
        this.objectOpenDoor.width * 0.05 * 1.5 -
        this.objectOpenDoor.width * 0.05
      ) / 2,
      0
    );

    this.objectClosedDoor = this.physics.add
      .staticImage(1400, 780, "closedDoor")
      .setScale(0.13);
    this.objectClosedDoor.refreshBody();
    this.objectClosedDoor.body.setSize(
      this.objectClosedDoor.width * 0.13 * 0.3,
      this.objectClosedDoor.height * 0.13
    );
    this.objectClosedDoor.body.setOffset(
      (this.objectClosedDoor.width * 0.13 -
        this.objectClosedDoor.width * 0.13 * 0.3) /
        2,
      0
    );

    this.objectClosedDoor.setVisible(false);
    this.objectClosedDoor.body.enable = false;

    // Lógica de control del ladrón
    this.LadronMovement = true;
    this.PoliciaVelocity = 200;
    this.LadronVelocity = 250;

    // Colisiones entre los personajes y el suelo
    this.physics.add.collider(
      this.playerPolicia,
      this.ground,
      this.handleBlockCollisionPolicia,
      null,
      this
    );
    this.physics.add.collider(
      this.playerLadron,
      this.ground,
      this.handleBlockCollisionLadron,
      null,
      this
    );

    this.physics.add.collider(this.playerPolicia, this.objectClosedDoor);
    this.physics.add.collider(this.playerLadron, this.objectClosedDoor);

    this.physics.add.collider(
      this.playerLadron,
      this.rect,
      this.handleBlockCollisionPolicia,
      null,
      this
    );

    // Colisiones entre el ladrón y las trampillas
    this.physics.add.overlap(
      this.playerLadron,
      this.ObjectTrampilla1,
      () => {
        if (this.thiefInteract.isDown && this.canUseTrampilla) {
          this.teleportLadron(this.ObjectTrampilla2); // Teletransporta al ladrón a la trampilla 2
          this.startTrampillaCooldown(); // Activar el cooldown
        }
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.playerLadron,
      this.ObjectTrampilla2,
      () => {
        if (this.thiefInteract.isDown && this.canUseTrampilla) {
          this.teleportLadron(this.ObjectTrampilla1); // Teletransporta al ladrón a la trampilla 1
          this.startTrampillaCooldown(); // Activar el cooldown
        }
      },
      null,
      this
    );
    this.physics.add.overlap(
        this.playerLadron,
        this.ObjectTrampilla3,
        () => {
          if (this.thiefInteract.isDown && this.canUseTrampilla1) {
            this.teleportLadron(this.ObjectTrampilla4); // Teletransporta al ladrón a la trampilla 1
            this.startTrampillaCooldown1(); // Activar el cooldown
          }
        },
        null,
        this
      );
      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectTrampilla4,
        () => {
          if (this.thiefInteract.isDown && this.canUseTrampilla1) {
            this.teleportLadron(this.ObjectTrampilla3); // Teletransporta al ladrón a la trampilla 1
            this.startTrampillaCooldown1(); // Activar el cooldown
          }
        },
        null,
        this
      );

      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectVentilacion1,
        () => {
          if (this.thiefInteract.isDown && this.canUseTrampilla2) {
            this.teleportLadron(this.ObjectVentilacion2); // Teletransporta al ladrón a la trampilla 1
            this.startTrampillaCooldown2(); // Activar el cooldown
          }
        },
        null,
        this
      );

      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectVentilacion2,
        () => {
          if (this.thiefInteract.isDown && this.canUseTrampilla2) {
            this.teleportLadron(this.ObjectVentilacion1); // Teletransporta al ladrón a la trampilla 1
            this.startTrampillaCooldown2(); // Activar el cooldown
          }
        },
        null,
        this
      );

    //Cierre de puertas
    this.physics.add.overlap(this.playerLadron, this.objectOpenDoor, () => {
      if (this.thiefInteract.isDown && !this.aDoorIsClosed) {
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
        });
      }
    });

    //this.cursors = this.input.keyboard.createCursorKeys();  // Para el policía (flecha arriba)
    //this.wasd = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });  // Para el ladrón (W)

    // Variables para manejar el doble salto
    this.jumpCountPolicia = 0; // Contador de saltos del policía
    this.jumpCountLadron = 0; // Contador de saltos del ladrón
    this.maxJumpCount = 2; // Número máximo de saltos (doble salto)

    // Variables para el control del pegado a la pared
    this.isWallSlidingPolicia = false;
    this.isWallSlidingLadron = false;

    this.wallSlideTimePolicia = 0;
    this.wallSlideTimeLadron = 0;
    this.wallSlideDuration = 5000; // Duración de la "pegada" a la pared en milisegundos

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
    this.jumpCooldown = 250; // Tiempo entre saltos en milisegundos

    // Colisión entre los jugadores (policía y ladrón)
    this.physics.add.collider(
      this.playerPolicia,
      this.playerLadron,
      this.onCollision,
      null,
      this
    );

    // Pool de objetos y coordenadas
    this.objectPool = ["reloj", "rosquilla", "red", "cepo"];
    this.positionPool = [
      //{ x: 730 ,y:430 },
      { x:920 , y: 470},
      //{ x: 925, y: 700 },
      //{ x: 1150, y: 465 },
      //{ x: 1215, y: 645 }
    ];

    // Inventario del policia (vacio inicialmente)
    this.policiaInventory = null;
    this.objectIcono.setTexture(this.objectIcono.image);

    // Generar un objeto Modificador en una posición aleatoria
    this.spawnRandomModifier();

    this.add
      .text(width / 4, 50, `Jugador 1: ${this.registry.get("player1Rounds")}`, {
        fontFamily: "retro-computer",
        fontSize: "32px",
        fill: "#ffff",
      })
      .setOrigin(0.5);
    this.add
      .text(
        width - width / 4,
        50,
        `Jugador 2: ${this.registry.get("player2Rounds")}`,
        {
          fontFamily: "retro-computer",
          fontSize: "32px",
          fill: "#ffff",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-ESC", () => {
      this.game.audioManager.setVolume(0.2);
      this.scene.launch("PauseScene");
      this.scene.pause();
    });

    //Animations
    this.anims.create({
      key: "police_idle",
      frames: this.anims.generateFrameNames("policia", {
        prefix: "idle",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "police_run",
      frames: this.anims.generateFrameNames("policia", {
        prefix: "run",
        end: 5,
        zeroPad: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "police_jump",
      frames: this.anims.generateFrameNames("policia", {
        prefix: "jump",
        end: 8,
        zeroPad: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "police_wall",
      frames: this.anims.generateFrameNames("policia", {
        prefix: "wall",
        end: 3,
        zeroPad: 3,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
        key: "police_walljump",
        frames: this.anims.generateFrameNames("policia", {
          prefix: "walljump",
          end: 9,
          zeroPad: 3,
        }),
        frameRate: 15,
        repeat: -1,
      });

    //Animaciones ladron
    this.anims.create({
        key: "thief_idle",
        frames: this.anims.generateFrameNames("ladron", {
          prefix: "idle",
          end: 4,
          zeroPad: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
  
      this.anims.create({
        key: "thief_run",
        frames: this.anims.generateFrameNames("ladron", {
          prefix: "run",
          end: 7,
          zeroPad: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
  
      this.anims.create({
        key: "thief_jump",
        frames: this.anims.generateFrameNames("ladron", {
          prefix: "jump",
          end: 7,
          zeroPad: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "thief_wall",
        frames: this.anims.generateFrameNames("ladron", {
          prefix: "wall",
          end: 4,
          zeroPad: 3,
        }),
        frameRate: 6,
        repeat: -1,
      });
  
      this.anims.create({
          key: "thief_walljump",
          frames: this.anims.generateFrameNames("ladron", {
            prefix: "walljump",
            end: 9,
            zeroPad: 3,
          }),
          frameRate: 15,
          repeat: -1,
        });
  }

  spawnRandomModifier() {
    // Seleccionar una posición aleatoria de la pool
    //const randomPos = Phaser.Utils.Array.RemoveRandomElement(this.positionPool);
    if (this.policiaInventory == null) {
      const randomPos =
        this.positionPool[Math.floor(Math.random() * this.positionPool.length)];

      // Crear un sprite en esa posición con la imagen de 'Modificador'
      this.currentModifier = this.physics.add.staticImage(
        randomPos.x,
        randomPos.y,
        "Modificador"
      ).setScale(0.3);

      // Añadir colisión con el policía para recoger el modificador
      this.physics.add.overlap(
        this.playerPolicia,
        this.currentModifier,
        this.collectModifier,
        null,
        this
      );
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
    let itemImage = this.add
      .image(
        this.playerPolicia.x,
        this.playerPolicia.y - 50,
        `${this.policiaInventory}`
      )
      .setOrigin(0.5)
      .setScale(1);

    this.tweens.add({
      targets: itemImage,
      y: itemImage.y - 50,
      ease: "Power1",
      duration: 500,
      onComplete: () => {
        console.log("DONE");
        this.tweens.add({
          targets: itemImage,
          alpha: 0,
          duration: 200,
          ease: "Linear",
          onComplete: () => {
            itemImage.destroy();
          },
        });
      },
    });

    switch (this.policiaInventory) {
      case "reloj":
        this.timeLeft += 20;
        this.timerText.setText(this.formatTime(this.timeLeft));
        break;
      case "rosquilla":
        this.PoliciaVelocity *= 2;
        this.time.delayedCall(3000, () => {
          this.PoliciaVelocity /= 2;
        });
        break;
      case "red":
        this.lanzarRed();
        break;
      case "cepo":
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
      this.spawnRandomModifier();
    }, 3000);
  }

  lanzarRed() {
    let redStartingX = this.policiaFacingRight
      ? this.playerPolicia.x + 20
      : this.playerPolicia.x - 20;

    let red = this.physics.add
      .image(redStartingX, this.playerPolicia.y, "red")
      .setOrigin(0.5);
    red.body.setAllowGravity(false);

    let launchAnimation = this.tweens.add({
      targets: red,
      x: this.policiaFacingRight ? red.x + 100 : red.x - 100,
      ease: "Power1",
      duration: 500,
      onComplete: () => {
        console.log("DONE");
        this.tweens.add({
          targets: red,
          alpha: 0,
          duration: 200,
          ease: "Linear",
          onComplete: () => {
            red.destroy();
          },
        });
      },
    });

    this.physics.add.collider(
      this.playerLadron,
      red,
      () => {
        launchAnimation.stop();
        this.tweens.add({
          targets: red,
          alpha: 0,
          duration: 200,
          ease: "Linear",
          onComplete: () => {
            red.destroy();
          },
        });

        this.stopThief();
      },
      null,
      this
    );
  }

  stopThief() {
    console.log("STOPING THIEF");
    this.LadronMovement = false;
    this.time.delayedCall(2000, () => {
        console.log("STOPED THIEF");
        this.LadronMovement = true;
    });
  }

  update(time, delta) {

    if(!this.policiaFacingRight && !this.isWallSlideJumpingPolicia) {
        this.playerPolicia.flipX = true;
    } else if(this.policiaFacingRight && !this.isWallSlideJumpingPolicia) {
        this.playerPolicia.flipX = false;
    }

    if(!this.ladronFacingRight && !this.isWallSlideJumpingLadron) {
        this.playerLadron.flipX = true;
    } else if(this.ladronFacingRight && !this.isWallSlideJumpingLadron) {
        this.playerLadron.flipX = false;
    }

    // Movimiento del policía
    if(!this.isWallSlideJumpingPolicia)
    {
        if (this.policeControls.left.isDown) {
            this.playerPolicia.setVelocityX(-this.PoliciaVelocity * this.time.timeScale);
            this.policiaFacingRight = false;
            if(this.playerPolicia.body.touching.down) {
                this.playerPolicia.anims.play('police_run', true);
            }
        } else if (this.policeControls.right.isDown) {
            this.playerPolicia.setVelocityX(this.PoliciaVelocity * this.time.timeScale);
            this.policiaFacingRight = true;
            if(this.playerPolicia.body.touching.down) {
                this.playerPolicia.anims.play('police_run', true);
            }
        } else {
            this.playerPolicia.setVelocityX(0);
            if(this.playerPolicia.body.touching.down) {
                this.playerPolicia.anims.play('police_idle', true);
            }
        }
    } else {
        if(this.wallSlideTimerPolicia && this.wallSlideTimerPolicia.getRemaining() <= 0) {
            this.isWallSlideJumpingPolicia = false;
        }
    }

    // Movimiento del ladrón
    if(!this.isWallSlideJumpingLadron && this.LadronMovement)
        {
            if (this.thiefControls.left.isDown) {
                this.playerLadron.setVelocityX(-this.LadronVelocity * this.time.timeScale);
                this.ladronFacingRight = false;
                if(this.playerLadron.body.touching.down) {
                    this.playerLadron.anims.play('thief_run', true);
                }
            } else if (this.thiefControls.right.isDown) {
                this.playerLadron.setVelocityX(this.LadronVelocity * this.time.timeScale);
                this.ladronFacingRight = true;
                if(this.playerLadron.body.touching.down) {
                    this.playerLadron.anims.play('thief_run', true);
                }
            } else {
                this.playerLadron.setVelocityX(0);
                if(this.playerLadron.body.touching.down) {
                    this.playerLadron.anims.play('thief_idle', true);
                }
            }
        } else {
            if(this.wallSlideTimerLadron && this.wallSlideTimerLadron.getRemaining() <= 0) {
                this.isWallSlideJumpingLadron = false;
            }
        }

    // Detectar si el jugador está pegado a la pared (si está tocando la pared)
    this.checkWallSlide(this.playerPolicia);
    this.checkWallSlide(this.playerLadron);

    if (this.policeControls.up.isDown && this.canJumpPolicia) {
        if (this.isWallSlidingPolicia) {
            //Salto de pared
            this.handleWallJump(this.playerPolicia);
        } else if (this.playerPolicia.body.touching.down || this.jumpCountPolicia < this.maxJumpCount) {
            this.playerPolicia.anims.play('police_jump', true);
            this.playerPolicia.setVelocityY(-350 * this.time.timeScale);
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
        //Salto de pared
        this.handleWallJump(this.playerLadron);
      } else if (
        this.playerLadron.body.touching.down ||
        this.jumpCountLadron < this.maxJumpCount
      ) {
        this.playerLadron.anims.play('thief_jump', true);
        this.playerLadron.setVelocityY(-350 * this.time.timeScale);
        this.jumpCountLadron++; // Incrementa el contador de saltos
      }
      this.canJumpLadron = false; // Desactivar el salto por un tiempo
      this.time.delayedCall(this.jumpCooldown, () => {
        this.canJumpLadron = true; // Reactivar el salto después del cooldown
      });
    }

    // Detectar si el ladrón está acelerando
    if (this.thiefControls.down.isDown && !this.isBoosting) {
      this.isBoosting = true; // Bloquea nuevas aceleraciones
      this.LadronVelocity += 300; // Incrementa la velocidad
      this.time.delayedCall(200, () => {
        this.LadronVelocity -= 300; // Restaura la velocidad normal
      });
      // Reinicia la capacidad de acelerar después de 2 segundos
      this.time.delayedCall(2000, () => {
        this.isBoosting = false; // Permite volver a acelerar
      });
    }

    // Detectar cuando se presione la tecla Enter
    if (this.policeInteract.isDown) {
      this.useModifier();
    }
  }

    handleWallJump(player) {
        if(player === this.playerPolicia){
            if(this.playerPolicia.body.blocked.left) {
                this.isWallSlideJumpingPolicia = true;
                this.isWallSlidingPolicia = false;
                this.playerPolicia.setVelocityY(-450 * this.time.timeScale);
                this.playerPolicia.setVelocityX(180 * this.time.timeScale);
                this.playerPolicia.flipX = false;
                this.playerPolicia.anims.play('police_walljump') 
            } else if(this.playerPolicia.body.blocked.right) {
                this.isWallSlideJumpingPolicia = true;
                this.isWallSlidingPolicia = false;
                this.playerPolicia.setVelocityY(-450 * this.time.timeScale);
                this.playerPolicia.setVelocityX(-180 * this.time.timeScale);
                this.playerPolicia.flipX = true;
                this.playerPolicia.anims.play('police_walljump')
            }
            this.wallSlideTimerPolicia = this.time.delayedCall(50, () => {
                this.isWallSlideJumpingPolicia = false;
            })
            this.jumpCountPolicia = 1;
        }
        if(player === this.playerLadron){
            if(this.playerLadron.body.blocked.left) {
                this.isWallSlideJumpingLadron = true;
                this.isWallSlidingLadron = false;
                this.playerLadron.setVelocityY(-450 * this.time.timeScale);
                this.playerLadron.setVelocityX(180 * this.time.timeScale);
                this.playerLadron.flipX = false;
                this.playerLadron.anims.play('thief_walljump') 
            } else if(this.playerLadron.body.blocked.right) {
                this.isWallSlideJumpingLadron = true;
                this.isWallSlidingLadron = false;
                this.playerLadron.setVelocityY(-450 * this.time.timeScale);
                this.playerLadron.setVelocityX(-180 * this.time.timeScale);
                this.playerLadron.flipX = true;
                this.playerLadron.anims.play('thief_walljump')
            }
            this.wallSlideTimerLadron = this.time.delayedCall(50, () => {
                this.isWallSlideJumpingLadron = false;
            })
            this.jumpCountLadron = 1;
        }
    }

  updateTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timerText.setText(this.formatTime(this.timeLeft));
    } else {
      this.timerEvent.remove();

      let player1IsPolice = this.registry.get("player1IsPolice");
      this.registry.set("player1IsPolice", !player1IsPolice);

      if (player1IsPolice) {
        const player2Rounds = this.registry.get("player2Rounds") + 1;
        this.registry.set("player2Rounds", player2Rounds);

        if (player2Rounds >= 3) {
          this.scene.start("VictoryScene", { winner: "Jugador 2" });
          this.registry.set("player1Rounds", 0);
          this.registry.set("player2Rounds", 0);
        } else {
          this.playRoundWin("Ladron");
        }
      } else {
        const player1Rounds = this.registry.get("player1Rounds") + 1;
        this.registry.set("player1Rounds", player1Rounds);

        if (player1Rounds >= 3) {
          this.scene.start("VictoryScene", { winner: "Jugador 1" });
          this.registry.set("player1Rounds", 0);
          this.registry.set("player2Rounds", 0);
        } else {
          this.playRoundWin("Ladron");
        }
      }
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const partInSeconds = seconds % 60;
    return `${minutes}:${partInSeconds.toString().padStart(2, "0")}`;
  }

  handleBlockCollisionPolicia(player, block) {
    const playerBottom = player.body.bottom;
    const playerLeft = player.body.left;
    const playerRight = player.body.right;

    const blockTop = block.body.top;
    const blockLeft = block.body.left;
    const blockRight = block.body.right;

    if (playerBottom <= blockTop + 5) {
      this.resetJumpPolicia();
    } else if (playerRight >= blockLeft && player.body.touching.right) {
      this.handleWallCollisionPolicia();
    } else if (playerLeft <= blockRight && player.body.touching.left) {
      this.handleWallCollisionPolicia();
    }
  }

  handleBlockCollisionLadron(player, block) {
    const playerBottom = player.body.bottom;
    const playerLeft = player.body.left;
    const playerRight = player.body.right;

    const blockTop = block.body.top;
    const blockLeft = block.body.left;
    const blockRight = block.body.right;

    if (playerBottom <= blockTop + 5) {
      this.resetJumpLadron();
    } else if (playerRight >= blockLeft && player.body.touching.right) {
      this.handleWallCollisionLadron();
    } else if (playerLeft <= blockRight && player.body.touching.left) {
      this.handleWallCollisionLadron();
    }
  }

  // Detectar si el jugador está pegado a la pared
  checkWallSlide(player) {
    if (player.body.blocked.left || player.body.blocked.right) {
      if (player.body.touching.down) {
        // Si está tocando el suelo, no se puede pegar a la pared
        this.isWallSlidingPolicia = false;
        return;
      }
      // El jugador se queda pegado a la pared durante un tiempo
      if (player === this.playerPolicia) {
        this.playerPolicia.body.blocked.left
          ? (this.playerPolicia.flipX = false)
          : (this.playerPolicia.flipX = true);
        this.playerPolicia.anims.play("police_wall", true);
        this.isWallSlidingPolicia = true;
        this.wallSlideTimePolicia = this.wallSlideDuration;
      } else if (player === this.playerLadron) {
        this.playerLadron.body.blocked.left
        ? (this.playerLadron.flipX = false)
        : (this.playerLadron.flipX = true);
      this.playerLadron.anims.play("thief_wall", true);
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
      this.playerPolicia.setVelocityY(0); // Detener la caída
      this.wallSlideTimePolicia -= 10; // Reducir el tiempo de pegado (cada tick)
      // Reiniciar contador de saltos cuando colisiona con la pared
      this.jumpCountPolicia = 1;
    } else {
      this.isWallSlidingPolicia = false; // Terminar el tiempo pegado
    }
  }

  // Función para manejar la colisión con la pared para el ladrón
  handleWallCollisionLadron() {
    if (this.wallSlideTimeLadron > 0) {
      // El ladrón se queda pegado durante wallSlideDuration
      this.playerLadron.setVelocityY(0); // Detener la caída
      this.wallSlideTimeLadron -= 10; // Reducir el tiempo de pegado (cada tick)
      // Reiniciar contador de saltos cuando colisiona con la pared
      this.jumpCountLadron = 1;
    } else {
      this.isWallSlidingLadron = false; // Terminar el tiempo pegado
    }
  }

  teleportLadron(targetTrampilla) {
    // Cambiar las coordenadas del ladrón a las de la trampilla de destino
    this.playerLadron.setX(targetTrampilla.x);
    this.playerLadron.setY(targetTrampilla.y);

    // Añadir un pequeño salto hacia arriba
    this.playerLadron.setVelocityY(-300 * this.time.timeScale); // Valor negativo para saltar hacia arriba

    // Añadir un efecto visual opcional (como un parpadeo)
    this.playerLadron.alpha = 0.5; // Cambiar temporalmente la opacidad
    this.time.delayedCall(200, () => {
      this.playerLadron.alpha = 1; // Restaurar la opacidad después de 200ms
    });
  }

  startTrampillaCooldown() {
    this.canUseTrampilla = false;
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla = true;
    });
  }

  startTrampillaCooldown1() {
    this.canUseTrampilla1 = false;
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla1 = true;
    });
  }

  startTrampillaCooldown2() {
    this.canUseTrampilla2 = false;
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla2 = true;
    });
  }

  // Resetear los contadores de saltos cuando los personajes tocan el suelo
  resetJumpPolicia() {
    this.jumpCountPolicia = 0; // Resetea el contador de saltos cuando toca el suelo
  }

  resetJumpLadron() {
    this.jumpCountLadron = 0; // Resetea el contador de saltos cuando toca el suelo
  }

  // Función que se llama cuando los jugadores colisionan
  onCollision() {
    if (this.collisionDetected) return;

    console.log("¡Colisión entre Policía y Ladrón!");
    this.collisionDetected = true;

    let player1IsPolice = this.registry.get("player1IsPolice");
    this.registry.set("player1IsPolice", !player1IsPolice);

    // Aquí puedes poner lo que deseas hacer cuando los personajes colisionan (por ejemplo, reiniciar el juego o cambiar de escena)
    if (player1IsPolice) {
      const player1Rounds = this.registry.get("player1Rounds") + 1;
      this.registry.set("player1Rounds", player1Rounds);

      if (player1Rounds >= 3) {
        this.scene.start("VictoryScene", { winner: "Jugador 1" });
        this.registry.set("player1Rounds", 0);
        this.registry.set("player2Rounds", 0);
      } else {
        this.playRoundWin("Policia");
      }
    } else {
      const player2Rounds = this.registry.get("player2Rounds") + 1;
      this.registry.set("player2Rounds", player2Rounds);

      if (player2Rounds >= 3) {
        this.scene.start("VictoryScene", { winner: "Jugador 2" });
        this.registry.set("player1Rounds", 0);
        this.registry.set("player2Rounds", 0);
      } else {
        this.playRoundWin("Policia");
      }
    }
  }

  playRoundWin(winner) {
    this.time.timeScale = 0.1;
    //this.input.keyboard.enabled = false;

    const winnerText = this.add
      .text(
        this.centerX,
        this.cameras.main.height / 2,
        `${winner} Gana Este Round!`,
        {
          fontFamily: "retro-computer",
          fontSize: "35px",
          fill: "#fff",
          backgroundColor: "#000",
        }
      )
      .setOrigin(0.5);

    winnerText.setDepth(9999);

    const fadeDuration = 300;
    //this.cameras.main.fadeOut(fadeDuration, 0, 0, 0);

    this.time.delayedCall(fadeDuration, () => {
      this.time.timeScale = 1;
      //this.cameras.main.fadeIn(0);
      this.scene.restart();
      this.input.keyboard.enabled = true;
    });
  }
}

export default GameScene;
