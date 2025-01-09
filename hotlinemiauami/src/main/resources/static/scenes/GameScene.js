class GameScene extends Phaser.Scene {
  constructor(config = {}) {
    super({ key: config.key || "GameScene" });

    this.isOnline = false; 

    this.keyStates = {
      KeyW: false,
      KeyA: false,
      KeyS: false,
      KeyD: false,
      Space: false,
      ShiftRight: false,
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
  }

  init(data) {
    console.log("STARTING");

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

    this.load.image("trampilla", "./Objetos/trampilla.png");
    this.load.image("escenario", "./Objetos/escenario.png");
    this.load.image("Marcador", "./Escenario/Marcador.png");

    this.load.image("carcelAbierta", "./Objetos/carcelAbierta.png");
    this.load.image("carcelCerrada", "./Objetos/carcelCerrada.png");
    this.load.image("puerta1Abierta", "./Objetos/puerta1Abierta.png");
    this.load.image("puerta1Cerrada", "./Objetos/puerta1Cerrada.png");
    this.load.image("puerta2Abierta", "./Objetos/puerta2Abierta.png");
    this.load.image("puerta2Cerrada", "./Objetos/puerta2Cerrada.png");
    this.load.image("puerta3Abierta", "./Objetos/puerta3Abierta.png");
    this.load.image("puerta3Cerrada", "./Objetos/puerta3Cerrada.png");

    this.load.image("ladronWin", "./Personajes/ladron.png");
    this.load.image("policiaWin", "./Personajes/policia.png");

    this.load.image("victory_frame", "./Interfaz/marco_victoria.png");
    this.load.image("victoria", "./Interfaz/victoria.png");
    this.load.image("victoria_1", "./Interfaz/victoria_1.png");
    this.load.image("victoria_2", "./Interfaz/victoria_2.png");

    this.load.image("boton_victoria", "./Interfaz/boton_victoria.png");

    this.load.audio("game_music", "./Musica/GAMEPLAYYYY.wav");
    this.load.audio("agarrar_objeto", "./Musica/Sonidos/agarrar_objeto_policia.wav");
    this.load.audio("activar_trampa", "./Musica/Sonidos/ladron_activa_trampa.wav");
    this.load.audio("teletransporte", "./Musica/Sonidos/teletransporte.wav");
    this.load.audio("usar_objeto", "./Musica/Sonidos/usar_objeto_policia.wav");
  }

  create() {

    // Ajustar la cámara
    const camera = this.cameras.main;
    camera.setBounds(370, 210, 960, 540);
    camera.setZoom(2.6);
    
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

    {
    this.input.keyboard.on('keydown', (event) => {
      const key = event.code;
      if (key in this.keyStates) {
          this.keyStates[key] = true;
      }
    });

    this.input.keyboard.on('keyup', (event) => {
        const key = event.code;
        if (key in this.keyStates) {
            this.keyStates[key] = false;
        }
    });

    this.policiaFacingRight = true;
    this.ladronFacingRight = true;

    // Variable de trampilla
    this.canUseTrampilla = true;
    this.canUseTrampilla1 = true;
    this.canUseTrampilla2 = true;

    // Agregar objetos y suelo
    this.ground = this.physics.add.staticGroup();

    this.ground.create(960, 540, "escenario").setDepth(-1);

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
    //this.registry.get('player1IsPolice') ? this.objectIcono = this.add.image(710, 350, "icono") : this.objectIcono = this.add.image(1210, 350, "icono");
    this.registry.get('player1IsPolice') ? this.itemPos = 707 : this.itemPos = 1212;

    this.ObjectTrampilla1 = this.physics.add.staticImage(1203, 410, "Marcador").setScale(0.3);
    this.ObjectTrampilla2 = this.physics.add.staticImage(1203, 595, "Marcador").setScale(0.3);
    this.ObjectTrampilla3 = this.physics.add.staticImage(995, 602, "Marcador").setScale(0.3);
    this.ObjectTrampilla4 = this.physics.add.staticImage(838, 602, "Marcador").setScale(0.3);
    this.ObjectVentilacion1 = this.physics.add.staticImage(730, 535, "Marcador").setScale(0.3);
    this.ObjectVentilacion2 = this.physics.add.staticImage(730, 458, "Marcador").setScale(0.3);

    this.ObjectTrampilla1.setTint(0x00ff00);
    this.ObjectTrampilla2.setTint(0x00ff00);
    this.ObjectTrampilla3.setTint(0x00ff00);
    this.ObjectTrampilla4.setTint(0x00ff00);
    this.ObjectVentilacion1.setTint(0x00ff00);
    this.ObjectVentilacion2.setTint(0x00ff00);

    
    this.carcelOpenDoor = this.physics.add
      .staticImage(780, 647, "carcelAbierta")
      .setSize(70, 50);

    this.carcelClosedDoor = this.physics.add
      .staticImage(780, 647, "carcelCerrada")
      .setSize(10, 50);

    this.carcelClosedDoor.setVisible(false);
    this.carcelClosedDoor.body.enable = false;

    this.floor1OpenDoor = this.physics.add
    .staticImage(789, 583, "puerta1Abierta")
    .setSize(55, 50);

    this.floor1ClosedDoor = this.physics.add
        .staticImage(793, 583, "puerta1Cerrada")
        .setSize(14, 50);

    this.floor1ClosedDoor.setVisible(false);
    this.floor1ClosedDoor.body.enable = false;

    this.floor2OpenDoor = this.physics.add
    .staticImage(685, 510, "puerta2Abierta")
    .setSize(55, 50);

    this.floor2ClosedDoor = this.physics.add
        .staticImage(678, 510, "puerta2Cerrada")
        .setSize(15, 50);

    this.floor2ClosedDoor.setVisible(false);
    this.floor2ClosedDoor.body.enable = false;

    this.floor3OpenDoor = this.physics.add
    .staticImage(785, 430, "puerta3Abierta")
    .setSize(55, 55);

    this.floor3ClosedDoor = this.physics.add
        .staticImage(792, 430, "puerta3Cerrada")
        .setSize(16, 52);

    this.floor3ClosedDoor.setVisible(false);
    this.floor3ClosedDoor.body.enable = false;
  }

    //Variable de puerta
    this.puerta1IsClosed = false;
    this.puerta2IsClosed = false;
    this.puerta3IsClosed = false;
    this.carcelIsClosed = false;

    //Fisicas de puertas cerradas
    this.physics.add.collider(this.playerPolicia, this.carcelClosedDoor);
    this.physics.add.collider(this.playerLadron, this.carcelClosedDoor);
    this.physics.add.collider(this.playerPolicia, this.floor1ClosedDoor);
    this.physics.add.collider(this.playerLadron, this.floor1ClosedDoor);
    this.physics.add.collider(this.playerPolicia, this.floor2ClosedDoor);
    this.physics.add.collider(this.playerLadron, this.floor2ClosedDoor);
    this.physics.add.collider(this.playerPolicia, this.floor3ClosedDoor);
    this.physics.add.collider(this.playerLadron, this.floor3ClosedDoor);

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
        if(this.registry.get('player1IsPolice')) {
          if (this.keyStates['ShiftRight'] && this.canUseTrampilla) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectTrampilla2); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 1
                }));
              }
          }
        } else {
          if (this.keyStates['Space'] && this.canUseTrampilla) {
            this.sound.play("teletransporte");
            this.teleportLadron(this.ObjectTrampilla2); // Teletransporta al ladrón a la trampilla 2
            this.startTrampillaCooldown(); // Activar el cooldown

            if (this.isOnline) {
              this.socket.send(JSON.stringify({
                  type: 'TRAMPILLA_USED',
                  trampillaId: 1
              }));
            }
          }
        }
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.playerLadron,
      this.ObjectTrampilla2,
      () => {
        if(this.registry.get('player1IsPolice')) {
          if (this.keyStates['ShiftRight'] && this.canUseTrampilla) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectTrampilla1); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 1
                }));
              }
          }
        } else {
          if (this.keyStates['Space'] && this.canUseTrampilla) {
            this.sound.play("teletransporte");
            this.teleportLadron(this.ObjectTrampilla1); // Teletransporta al ladrón a la trampilla 2
            this.startTrampillaCooldown(); // Activar el cooldown

            if (this.isOnline) {
              this.socket.send(JSON.stringify({
                  type: 'TRAMPILLA_USED',
                  trampillaId: 1
              }));
            }
          }
        }
      },
      null,
      this
    );
    this.physics.add.overlap(
        this.playerLadron,
        this.ObjectTrampilla3,
        () => {
          if(this.registry.get('player1IsPolice')) {
            if (this.keyStates['ShiftRight'] && this.canUseTrampilla1) {
                this.sound.play("teletransporte");
                this.teleportLadron(this.ObjectTrampilla4); // Teletransporta al ladrón a la trampilla 2
                this.startTrampillaCooldown1(); // Activar el cooldown

                if (this.isOnline) {
                  this.socket.send(JSON.stringify({
                      type: 'TRAMPILLA_USED',
                      trampillaId: 2
                  }));
                }
            }
          } else {
            if (this.keyStates['Space'] && this.canUseTrampilla1) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectTrampilla4); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown1(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 2
                }));
              }
            }
          }
        },
        null,
        this
      );
      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectTrampilla4,
        () => {
          if(this.registry.get('player1IsPolice')) {
            if (this.keyStates['ShiftRight'] && this.canUseTrampilla1) {
                this.sound.play("teletransporte");
                this.teleportLadron(this.ObjectTrampilla3); // Teletransporta al ladrón a la trampilla 2
                this.startTrampillaCooldown1(); // Activar el cooldown

                if (this.isOnline) {
                  this.socket.send(JSON.stringify({
                      type: 'TRAMPILLA_USED',
                      trampillaId: 2
                  }));
                }
            }
          } else {
            if (this.keyStates['Space'] && this.canUseTrampilla1) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectTrampilla3); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown1(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 2
                }));
              }
            }
          }
        },
        null,
        this
      );

      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectVentilacion1,
        () => {
          if(this.registry.get('player1IsPolice')) {
            if (this.keyStates['ShiftRight'] && this.canUseTrampilla2) {
                this.sound.play("teletransporte");
                this.teleportLadron(this.ObjectVentilacion2); // Teletransporta al ladrón a la trampilla 2
                this.startTrampillaCooldown2(); // Activar el cooldown

                if (this.isOnline) {
                  this.socket.send(JSON.stringify({
                      type: 'TRAMPILLA_USED',
                      trampillaId: 3
                  }));
                }
            }
          } else {
            if (this.keyStates['Space'] && this.canUseTrampilla2) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectVentilacion2); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown2(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 3
                }));
              }
            }
          }
        },
        null,
        this
      );

      this.physics.add.overlap(
        this.playerLadron,
        this.ObjectVentilacion2,
        () => {
          if(this.registry.get('player1IsPolice')) {
            if (this.keyStates['ShiftRight'] && this.canUseTrampilla2) {
                this.sound.play("teletransporte");
                this.teleportLadron(this.ObjectVentilacion1); // Teletransporta al ladrón a la trampilla 2
                this.startTrampillaCooldown2(); // Activar el cooldown

                if (this.isOnline) {
                  this.socket.send(JSON.stringify({
                      type: 'TRAMPILLA_USED',
                      trampillaId: 3
                  }));
                }
            }
          } else {
            if (this.keyStates['Space'] && this.canUseTrampilla2) {
              this.sound.play("teletransporte");
              this.teleportLadron(this.ObjectVentilacion1); // Teletransporta al ladrón a la trampilla 2
              this.startTrampillaCooldown2(); // Activar el cooldown

              if (this.isOnline) {
                this.socket.send(JSON.stringify({
                    type: 'TRAMPILLA_USED',
                    trampillaId: 3
                }));
              }
            }
          }
        },
        null,
        this
      );

    //Cierre de puertas
    this.physics.add.overlap(this.playerLadron, this.carcelOpenDoor, () => {
      if(this.registry.get('player1IsPolice')) {
        if (this.keyStates['ShiftRight'] && !this.carcelIsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('carcel', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'carcel',
                action: 'close'
            }));
          }
        }
      } else {
        if (this.keyStates['Space'] && !this.carcelIsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('carcel', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'carcel',
                action: 'close'
            }));
          }
        }
      }
    });

    this.physics.add.overlap(this.playerLadron, this.floor1OpenDoor, () => {
      if(this.registry.get('player1IsPolice')) {
        if (this.keyStates['ShiftRight'] && !this.puerta1IsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('floor1', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'floor1',
                action: 'close'
            }));
          }
        }
      } else {
        if (this.keyStates['Space'] && !this.puerta1IsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('floor1', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'floor1',
                action: 'close'
            }));
          }
        }
      }
    });

    this.physics.add.overlap(this.playerLadron, this.floor2OpenDoor, () => {
      if(this.registry.get('player1IsPolice')) {
        if (this.keyStates['ShiftRight'] && !this.puerta2IsClosed) {

            this.sound.play("activar_trampa");

            this.handleDoorAction('floor2', 'close');

            if (this.isOnline) {
              this.socket.send(JSON.stringify({
                  type: 'DOOR_USED',
                  door: 'floor2',
                  action: 'close'
              }));
            }
        }
      } else {
        if (this.keyStates['Space'] && !this.puerta2IsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('floor2', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'floor2',
                action: 'close'
            }));
          }
        }
      }
    });

    this.physics.add.overlap(this.playerLadron, this.floor3OpenDoor, () => {
      if(this.registry.get('player1IsPolice')) {
        if (this.keyStates['ShiftRight'] && !this.puerta3IsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('floor3', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'floor3',
                action: 'close'
            }));
          }
        }
      } else {
        if (this.keyStates['Space'] && !this.puerta3IsClosed) {

          this.sound.play("activar_trampa");

          this.handleDoorAction('floor3', 'close');

          if (this.isOnline) {
            this.socket.send(JSON.stringify({
                type: 'DOOR_USED',
                door: 'floor3',
                action: 'close'
            }));
          }
        }
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
      { x: 730 ,y:430 },
      { x:920 , y: 470},
      { x: 925, y: 700 },
      { x: 1150, y: 465 },
      { x: 1215, y: 645 }
    ];

    // Inventario del policia (vacio inicialmente)
    this.policiaInventory = null;
    //this.objectIcono.setTexture(this.objectIcono.image);

    this.add
      .text(820, 355, `Jugador 1: ${this.registry.get("player1Rounds")}`, {
        fontFamily: "retro-computer",
        fontSize: "14px",
        fill: "#ffff",
      })
      .setOrigin(0.5);
    this.add
      .text(1100, 355,`Jugador 2: ${this.registry.get("player2Rounds")}`,
        {
          fontFamily: "retro-computer",
          fontSize: "14px",
          fill: "#ffff",
        }
      )
      .setOrigin(0.5);

    this.input.keyboard.on("keydown-ESC", () => {
      if(!this.isOnline) {
        this.scene.launch("PauseScene");
        this.scene.pause();
      }
    });

    // Generar un objeto Modificador en una posición aleatoria
    this.spawnRandomModifier();

    this.add.rectangle(651, 370, 62, 62, 0x808080, 1);
    this.add.rectangle(1270, 370, 62, 62, 0x808080, 1);

    console.log(this.registry.get('player1IsPolice'));

    var policePos;
    var thiefPos;

    if(this.registry.get('player1IsPolice')) {
        policePos = 651;
        thiefPos = 1270;
    } else {
        policePos = 1270;
        thiefPos = 651;
    }

    this.add.image(policePos, 370, 'policiaWin');
    this.add.image(thiefPos, 370, 'ladronWin');

    this.pause = false;
  }

  spawnRandomModifier() {

    if(this.isOnline){
      return;
    }
    // Seleccionar una posición aleatoria de la pool
    //const randomPos = Phaser.Utils.Array.RemoveRandomElement(this.positionPool);
    if (this.policiaInventory == null) {
      const randomPos =
        this.positionPool[Math.floor(Math.random() * this.positionPool.length)];

      // Crear un sprite en esa posición con la imagen de 'Modificador'
      this.currentModifier = this.physics.add.sprite(
        randomPos.x,
        randomPos.y,
        'bonificaciones'
      );
      this.currentModifier.anims.play('item');
      this.currentModifier.body.setAllowGravity(false);

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
    if(!this.isOnline) {
      // Seleccionar un modificador aleatorio de la pool
      const randomModifier = Phaser.Utils.Array.GetRandom(this.objectPool);
      this.setModifier(randomModifier);

    } else if(this.isOnline && this.registry.get('player1IsPolice')){
      const randomModifier = Phaser.Utils.Array.GetRandom(this.objectPool);

      this.socket.send(JSON.stringify({
        type: 'COLLECT_ITEM',
        item: randomModifier,
      }));

      this.setModifier(randomModifier);
    }

    this.sound.play("agarrar_objeto");
    // Eliminar el sprite del modificador del juego
    this.currentModifier.destroy();
  }

  setModifier(item) {
    this.policiaInventory = item;
    this.objectIcono = this.add.sprite(this.itemPos, 354, 'bonificadores');
    this.objectIcono.anims.play(this.policiaInventory);
  }

  useModifier() {
    if (!this.policiaInventory) return;

    // Aplicar el efecto del modificador actual
    let itemImage = this.add
      .sprite(
        this.playerPolicia.x,
        this.playerPolicia.y - 20,
        'bonificadores'
      )
      .setOrigin(0.5)
      .setScale(1);

    if(this.isOnline && this.registry.get('player1IsPolice')) {
      this.socket.send(JSON.stringify({
        type: 'ITEM_USED',
      }));
    }

    itemImage.anims.play(this.policiaInventory);

    this.tweens.add({
      targets: itemImage,
      y: itemImage.y - 20,
      ease: "Power1",
      duration: 500,
      onComplete: () => {
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

    this.modifierEffect(this.policiaInventory);

    // Limpiar el inventario después de usar el modificador
    this.policiaInventory = null;
    this.objectIcono.destroy();

    // Generar un nuevo modificador después de usarlo
    setTimeout(() => {
      this.spawnRandomModifier();
    }, 3000);
  }

  modifierEffect(item){
    switch (item) {
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
  }

  lanzarRed() {
    let redStartingX = this.policiaFacingRight
      ? this.playerPolicia.x + 20
      : this.playerPolicia.x - 20;

    let red = this.physics.add
      .sprite(redStartingX, this.playerPolicia.y, 'bonificaciones')
      .setOrigin(0.5);
    red.anims.play('red');
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
    this.playerLadron.anims.play('thief_red')
    this.LadronMovement = false;
    this.time.delayedCall(2000, () => {
        console.log("STOPED THIEF");
        this.LadronMovement = true;
    });
  }

  update(time, delta) {

    if(!this.pause) {

      this.updatePoliceMovement(time, delta);
      this.updateThiefMovement(time, delta);

    } else {
        this.playerLadron.setVelocityX(0);
        this.playerLadron.setVelocityY(0);
        this.playerLadron.anims.stop();
        this.playerPolicia.setVelocityX(0);
        this.playerPolicia.setVelocityY(0);
        this.playerPolicia.anims.stop();
    }
  }

  updatePoliceMovement(time, delta) {
    if(!this.policiaFacingRight && !this.isWallSlideJumpingPolicia) {
        this.playerPolicia.flipX = true;
    } else if(this.policiaFacingRight && !this.isWallSlideJumpingPolicia) {
        this.playerPolicia.flipX = false;
    }

    if(!this.isWallSlideJumpingPolicia)
      {
        if(this.registry.get("player1IsPolice")) {
          if(this.keyStates['KeyA']) {
            this.playerPolicia.setVelocityX(-this.PoliciaVelocity * this.time.timeScale);
            this.policiaFacingRight = false;
            if(this.playerPolicia.body.touching.down) {
                this.playerPolicia.anims.play('police_run', true);
            }
          } else if(this.keyStates['KeyD']) {
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
          if(this.keyStates['ArrowLeft']) {
            this.playerPolicia.setVelocityX(-this.PoliciaVelocity * this.time.timeScale);
            this.policiaFacingRight = false;
            if(this.playerPolicia.body.touching.down) {
                this.playerPolicia.anims.play('police_run', true);
            }
          } else if(this.keyStates['ArrowRight']) {
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
        }
    } else {
          if(this.wallSlideTimerPolicia && this.wallSlideTimerPolicia.getRemaining() <= 0) {
              this.isWallSlideJumpingPolicia = false;
          }
    }

    this.checkWallSlide(this.playerPolicia);

    if(this.registry.get("player1IsPolice")) {
      if (this.keyStates['KeyW'] && this.canJumpPolicia) {
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
    } else {
      if (this.keyStates['ArrowUp'] && this.canJumpPolicia) {
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
    }

    // Detectar cuando se presione la tecla Enter
    if(this.registry.get("player1IsPolice")) {
      if (this.keyStates['Space'] && this.policiaInventory) {
        
          this.sound.play('usar_objeto');
          this.useModifier();
      }
    } else {
      if (this.keyStates['ShiftRight'] && this.policiaInventory) {
        this.sound.play('usar_objeto');
        this.useModifier();
      }
    }
  }

  updateThiefMovement(time, delta) {
    if(!this.ladronFacingRight && !this.isWallSlideJumpingLadron) {
      this.playerLadron.flipX = true;
    } else if(this.ladronFacingRight && !this.isWallSlideJumpingLadron) {
        this.playerLadron.flipX = false;
    }

    // Movimiento del ladrón
    if(!this.isWallSlideJumpingLadron && this.LadronMovement)
    {
      if(this.registry.get("player1IsPolice")) {
        if (this.keyStates['ArrowLeft']) {
            this.playerLadron.setVelocityX(-this.LadronVelocity * this.time.timeScale);
            this.ladronFacingRight = false;
            if(this.playerLadron.body.touching.down) {
                this.playerLadron.anims.play('thief_run', true);
            }
        } else if (this.keyStates['ArrowRight']) {
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
        if (this.keyStates['KeyA']) {
          this.playerLadron.setVelocityX(-this.LadronVelocity * this.time.timeScale);
          this.ladronFacingRight = false;
          if(this.playerLadron.body.touching.down) {
              this.playerLadron.anims.play('thief_run', true);
          }
      } else if (this.keyStates['KeyD']) {
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
      }
    } else {
        if(this.wallSlideTimerLadron && this.wallSlideTimerLadron.getRemaining() <= 0) {
            this.isWallSlideJumpingLadron = false;
        }
    }

    // Detectar si el jugador está pegado a la pared (si está tocando la pared)
    this.checkWallSlide(this.playerLadron);

    // Salto del ladrón (doble salto)
    if(this.registry.get("player1IsPolice")) {
      if (this.keyStates['ArrowUp'] && this.canJumpLadron) {
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
    } else {
      if (this.keyStates['KeyW'] && this.canJumpLadron) {
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
    }

    // Detectar si el ladrón está acelerando
    /*
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
    */
  }

  shutdown() {
    this.input.keyboard.removeAllListeners(); // Remove all listeners
    Object.keys(this.keyStates).forEach(key => {
        this.keyStates[key] = false; // Reset key states
    });
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
    if(!this.pause) {
        if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timerText.setText(this.formatTime(this.timeLeft));
        } else {
        this.timerEvent.remove();

        let player1IsPolice = this.registry.get("player1IsPolice");
        this.registry.set("player1IsPolice", !player1IsPolice);
        if(this.isOnline) {
          this.onlineWin('ladron');
          return;
        }

        if (player1IsPolice) {
            const player2Rounds = this.registry.get("player2Rounds") + 1;
            this.registry.set("player2Rounds", player2Rounds);

            if (player2Rounds >= 3) {
                this.playVictory(2);
            } else {
            this.playRoundWin("Ladrón");
            }
        } else {
            const player1Rounds = this.registry.get("player1Rounds") + 1;
            this.registry.set("player1Rounds", player1Rounds);

            if (player1Rounds >= 3) {
                this.playVictory(1);
            } else {
            this.playRoundWin("Ladrón");
            }
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
    this.ObjectTrampilla1.setTint(0xff0000);
    this.ObjectTrampilla2.setTint(0xff0000);
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla = true;
      this.ObjectTrampilla1.setTint(0x00ff00);
      this.ObjectTrampilla2.setTint(0x00ff00);

    });
  }

  startTrampillaCooldown1() {

    this.canUseTrampilla1 = false;
    this.ObjectTrampilla3.setTint(0xff0000);
    this.ObjectTrampilla4.setTint(0xff0000);
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla1 = true;
      this.ObjectTrampilla3.setTint(0x00ff00);
      this.ObjectTrampilla4.setTint(0x00ff00);

    });
  }

  startTrampillaCooldown2() {

    this.canUseTrampilla2 = false;
    this.ObjectVentilacion1.setTint(0xff0000);
    this.ObjectVentilacion2.setTint(0xff0000);
    this.time.delayedCall(10000, () => {
      this.canUseTrampilla2 = true;
      this.ObjectVentilacion1.setTint(0x00ff00);
      this.ObjectVentilacion2.setTint(0x00ff00);

    });
  }

  handleDoorAction(door, action) {
    let openDoor, closedDoor, doorVar;

    switch(door) {
      case 'carcel':
        openDoor = this.carcelOpenDoor;
        closedDoor = this.carcelClosedDoor;
        doorVar = 'carcelIsClosed';
        break;
      case 'floor1':
        openDoor = this.floor1OpenDoor;
        closedDoor = this.floor1ClosedDoor;
        doorVar = 'puerta1IsClosed';
        break;
      case 'floor2':
        openDoor = this.floor2OpenDoor;
        closedDoor = this.floor2ClosedDoor;
        doorVar = 'puerta2IsClosed';
        break;
      case 'floor3':
        openDoor = this.floor3OpenDoor;
        closedDoor = this.floor3ClosedDoor;
        doorVar = 'puerta3IsClosed';
        break;
    }

    if(action === 'close') {
      openDoor.setVisible(false);
      openDoor.body.enable = false;

      closedDoor.setVisible(true);
      closedDoor.body.enable = true;

      this[doorVar] = true;

      this.time.delayedCall(10000, () => {
        openDoor.setVisible(true);
        openDoor.body.enable = true;

        closedDoor.setVisible(false);
        closedDoor.body.enable = false;

        this[doorVar] = false;
      });
    }
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
    if(this.isOnline) {
      this.onlineWin('policia');
      return;
    }

    // Aquí puedes poner lo que deseas hacer cuando los personajes colisionan (por ejemplo, reiniciar el juego o cambiar de escena)
    if (player1IsPolice) {
      const player1Rounds = this.registry.get("player1Rounds") + 1;
      this.registry.set("player1Rounds", player1Rounds);

      if (player1Rounds >= 3) {
        this.playVictory(1);
      } else {
        this.playRoundWin("Policía");
      }
    } else {
      const player2Rounds = this.registry.get("player2Rounds") + 1;
      this.registry.set("player2Rounds", player2Rounds);

      if (player2Rounds >= 3) {
        this.playVictory(2);
      } else {
        this.playRoundWin("Policía");
      }
    }
  }

  onlineWin(winner) {
    this.registry.set("localIsPolice", !this.localIsPolice);

    const isWinnerPolice = (winner === 'policia');
    const isLocalWinner = (isWinnerPolice && this.localIsPolice) || (!isWinnerPolice && !this.localIsPolice);

    if(isLocalWinner) {
      this.incrementScore(this.isPlayer1, winner);
    } else {
      this.incrementScore(!this.isPlayer1, winner);
    }
  }

  incrementScore(isPlayer1, winner) {
    const player = isPlayer1 ? "player1Rounds" : "player2Rounds";
    const playerNum = isPlayer1 ? 1 : 2;
    const playerRounds = this.registry.get(player) + 1;

    this.registry.set(player, playerRounds);

    if(playerRounds >= 3) {
      this.playVictory(playerNum);
    } else {
      this.playRoundWin(winner === 'policia' ? "Policía" : "Ladrón");
    }
  }

  playRoundWin(winner) {
    this.time.timeScale = 0.1;

    const winnerFrame = this.add.image(this.centerX, this.cameras.main.height / 2, 'victory_frame').setOrigin(0.5);
    const winnerText = this.add
    .text(
      this.centerX,
      this.cameras.main.height / 2 - 70,
      `${winner} Gana Este Round!`,
      {
        fontFamily: "retro-computer",
        fontSize: "20px",
        fill: "#fff",
      }
    )
    .setOrigin(0.5);

    let winnerImage = winner === "Policía" ? 'policiaWin' : 'ladronWin';
    console.log(winnerImage);
    let victoryImage = this.add.image(this.centerX, winnerText.y + 70, winnerImage).setScale(2);

    this.add.text(this.centerX - 150, victoryImage.y + 65, 'J1 ', {
        fontFamily: "retro-computer",
        fontSize: "20px",
        fill: "#ff0000",
    }).setOrigin(0.5);

    this.add.text(this.centerX - 100, victoryImage.y + 65, `${this.registry.get('player1Rounds')}`, {
        fontFamily: "retro-computer",
        fontSize: "32px",
        fill: "#fff",
    }).setOrigin(0.5);

    this.add.text(this.centerX + 100, victoryImage.y + 65, 'J2 ', {
        fontFamily: "retro-computer",
        fontSize: "20px",
        fill: "#0000FF",
    }).setOrigin(0.5);

    this.add.text(this.centerX + 150, victoryImage.y + 65, `${this.registry.get('player2Rounds')}`, {
        fontFamily: "retro-computer",
        fontSize: "32px",
        fill: "#fff",
    }).setOrigin(0.5);

    const fadeDuration = 300;
    //this.cameras.main.fadeOut(fadeDuration, 0, 0, 0);

    this.time.delayedCall(fadeDuration, () => {
      this.time.timeScale = 1;

      if (this.isOnline && this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.pause=true;
        this.socket.send(JSON.stringify({ type: 'ROUND_RESET' }));
      }

      this.scene.restart();
      this.input.keyboard.enabled = true;
    });
  }

  playVictory(player) {
    this.add.image(this.centerX, this.centerY + 200, 'victoria');
    this.add.image(this.centerX, this.centerY + 200, `victoria_${player}`);
    this.pause = true;

    this.registry.set("player1Rounds", 0);
    this.registry.set("player2Rounds", 0);

    if(this.isOnline) {
                
      const userData = this.registry.get('userData');
      const roomData = this.roomData;

      this.time.delayedCall(5000, () => {

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {

          this.socket.send(JSON.stringify({
            type: "SET_READY",
            username: userData.username,
            isReady: false
          }));

          console.log("Closing WebSocket...");
          this.socket.close();
        }

        this.scene.start('LobbyScene', {
            roomData: roomData,
            userData: userData
        });
      });
    } else {
      const nextButton = this.add.image(this.centerX + 300, this.centerY + 360, 'boton_victoria').setInteractive();

      nextButton.on('pointerdown', () => {
          this.scene.start("MainMenuScene");
      });
    }
  }

}

export default GameScene;