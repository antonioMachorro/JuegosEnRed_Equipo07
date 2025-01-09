import BaseScene from "./BaseScene.js";

class MainMenuScene extends BaseScene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar las imágenes y música
        this.load.image('Jugar', './Interfaz/Jugar.png');
        this.load.image('Opciones', './Interfaz/Opciones.png');
        this.load.image('Salir', './Interfaz/Salir.png');
        this.load.image('Creditos', './Interfaz/Creditos.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.audio('menu_music', './Musica/MENUU.wav');
        this.load.image('online', './Interfaz/enlinea.png');
        this.load.image('offline', './Interfaz/offline.png');
        this.load.image('borrar', './Interfaz/borrarAcc.png');
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('tutorial', './Interfaz/tutorial.png');

        
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
    
        this.load.atlas(
            "bonificaciones",
            "./Objetos/Bonificaciones_Spritesheet.png",
            "./Objetos/bonificaciones_spritesheet.json"
            );
    }

    create() {

        super.create();

        // Overlay mensajes
        this.alertsOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.65 } });
        this.alertsOverlay.fillRect(this.cameras.main.centerX - 400, this.cameras.main.centerY + 150, 800, 40);
        this.alertsOverlay.setDepth(10);
        this.alertsOverlay.setVisible(false);

        // Mensaje Ajustes guardados
        this.eliminatedText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Cuenta eliminada exitosamente', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
          .setOrigin(0.5)
          .setDepth(11)
          .setVisible(false);

         // Mensaje Credenciales invalidas
        this.invalidCredentialsText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Credenciales inválidas', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);


        this.userCountText = null;
        this.userCountNum = null;
        this.serverStatusLabel = null;
        this.serverStatusImage = null;

        this.game.audioManager.playMusic('menu_music');

        this.Interfaz = this.add.image(960, 540, 'menuPrincipal');

        // Crear botones y hacerlos interactivos
        const playButton = this.add.image(750, 560, 'Jugar').setInteractive();
        const creditsButton = this.add.image(1275, 720, 'Creditos').setInteractive();
        const tutorialButton = this.add.image(1175, 720, 'tutorial').setInteractive();
        const exitButton = this.add.image(750, 680, 'Salir').setInteractive();
        const optionsButton = this.add.image(772, 620, 'Opciones').setInteractive();
        const deleteButton = this.add.image(1225, 720, 'borrar').setInteractive().setScale(0.1);

        // Configuración de la cámara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        // Configuración de los botones
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene'); // Cambiar a la escena de Créditos
        });

        tutorialButton.on('pointerdown', () => {
            this.scene.start('TutorialScene'); // Cambiar a la escena de Créditos
        });

        playButton.on('pointerdown', () => {
            this.scene.start('GameModeScene'); // Cambiar a la escena de modo de juego
        });

        optionsButton.on('pointerdown', () => {
            this.scene.launch('OptionsScene', { originScene: 'MainMenuScene' }); // Cambiar a la escena de opciones
            this.scene.pause();
        });

        exitButton.on('pointerdown', async () => {
            await this.logoutUser();
            this.scene.start('TitleMenu');
        });

        deleteButton.on('pointerdown', () => {

            const marco = this.add.image(960, 540, 'marcoPause').setDepth(1);
        
            const confirmText = this.add.text(755, 470, '¿Quieres borrar la cuenta?', {
                fontFamily: 'retro-computer',
                fontSize: '20px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setDepth(2);

            this.add.text(confirmText.x + 20, confirmText.y + 20, 'Escribe tu contraseña para confirmar.', {
                fontFamily: 'retro-computer',
                fontSize: '12px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setDepth(2);

            //I want the new password field between the above text and the lower buttons.
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.placeholder = 'Contraseña';
            passwordInput.style.position = 'absolute';
            passwordInput.style.left = '50%';
            passwordInput.style.top = '50%'; // Adjust this to match the desired position
            passwordInput.style.transform = 'translate(-50%, -50%)';
            passwordInput.style.fontSize = '16px';
            passwordInput.style.padding = '10px';
            passwordInput.style.width = '300px';
            passwordInput.style.height = '40px';

            document.body.appendChild(passwordInput);

            const yesButton = this.add.text(980, 600, 'Sí', {
                fontFamily: 'retro-computer',
                fontSize: '18px',
                fill: '#00ff00'
            }).setInteractive().setDepth(2);
        
            const noButton = this.add.text(880, 600, 'No', {
                fontFamily: 'retro-computer',
                fontSize: '18px',
                fill: '#ff0000'
            }).setInteractive().setDepth(2);
        
            yesButton.on('pointerdown', async () => {

                const password = passwordInput.value;
                if(password === '') {
                    this.clearAlerts();
                    this.alertsOverlay.setVisible(true);
                    this.invalidCredentialsText.setVisible(true);
                } else {
                    await this.deleteButton(password);

                    marco.destroy();
                    confirmText.destroy();
                    yesButton.destroy();
                    noButton.destroy();
                    passwordInput.remove();
                    this.scene.start('TitleMenu'); 
                }
                
            });
        
            noButton.on('pointerdown', () => {
                marco.destroy();
                confirmText.destroy();
                yesButton.destroy();
                noButton.destroy();
                passwordInput.remove();
            });
        });
        
        this.userCountText = this.add.text(615, 340, 'Usuarios conectados:', {
            fontFamily: 'retro-computer',
            fontSize: '16px',
            fill: '#ffffff'
        })

        /*
        this.serverStatusLabel = this.add.text(615, 360, 'Estado del servidor:', {
            fontFamily: 'retro-computer',
            fontSize: '16px',
            fill: '#ffffff'
        });*/

        this.game.events.on('server-status-updated', this.updateServerStatus, this);
        //this.game.events.on('user-status-updated', this.updateServerStatus, this);
        this.game.events.on('connected-users-updated', this.updateUserCount, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            console.log("MainMenuScene shutting down, clearing interval");
            clearInterval(this.fetchIntervalId);
        });

        this.fetchConnectedUsers();

            // Animaciones
    {
        //Animaciones policia
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
    
          this.anims.create({
            key: "police_idle_shine",
            frames: this.anims.generateFrameNames("policia", {
              prefix: "idleshine",
              end: 3,
              zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
          });
    
          this.anims.create({
            key: "police_run_shine",
            frames: this.anims.generateFrameNames("policia", {
              prefix: "runshine",
              end: 5,
              zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
          });
    
          this.anims.create({
            key: "police_jump_shine",
            frames: this.anims.generateFrameNames("policia", {
              prefix: "jumpshine",
              end: 8,
              zeroPad: 3,
            }),
            frameRate: 10,
            repeat: -1,
          });
    
          this.anims.create({
            key: "police_wall_shine",
            frames: this.anims.generateFrameNames("policia", {
              prefix: "wallshine",
              end: 3,
              zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
          });
    
          this.anims.create({
            key: "police_wall_jump_shine",
            frames: this.anims.generateFrameNames("policia", {
              prefix: "walljumpshine",
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
    
          this.anims.create({
            key: "thief_red",
            frames: this.anims.generateFrameNames("ladron", {
              prefix: "red",
              end: 4,
              zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
          });
        
        //Animaciones objetos
        this.anims.create({
            key: "rosquilla",
            frames: this.anims.generateFrameNames("bonificaciones", {
                prefix: "dona",
                end: 7,
                zeroPad: 3,
            }),
            repeat: -1,
        });
    
        this.anims.create({
            key: "red",
            frames: this.anims.generateFrameNames("bonificaciones", {
                prefix: "red",
                end: 7,
                zeroPad: 3,
            }),
            repeat: -1,
        });
    
        this.anims.create({
            key: "reloj",
            frames: this.anims.generateFrameNames("bonificaciones", {
                prefix: "reloj",
                end: 7,
                zeroPad: 3,
            }),
            repeat: -1,
        });
    
        this.anims.create({
            key: "cepo",
            frames: this.anims.generateFrameNames("bonificaciones", {
                prefix: "cepo",
                end: 7,
                zeroPad: 3,
            }),
            repeat: -1,
        });
    
        this.anims.create({
            key: "item",
            frames: this.anims.generateFrameNames("bonificaciones", {
                prefix: "objeto",
                end: 4,
                zeroPad: 3,
            }),
            frameRate: 8,
            repeat: -1,
        });
    
        }

    }

    async deleteButton(password) {
        try {
            // Obtener datos del usuario del registro
            const userData = this.registry.get('userData');
            if (!userData || !userData.username) {
                console.warn('No hay datos de usuario en el registro.');
                return;
            }
    
            // Llamar al backend para borrar al usuario
            const response = await fetch("/api/users/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: userData.username, password: password }),
              });
    
            if (response.ok) {
                clearAlerts();
                this.alertsOverlay.setVisible(true);
                this.eliminatedText.setVisible(true);
                // Limpia los datos del usuario en el registro
                this.registry.set('userData', null);
                // Redirigir al menú inicial
                this.scene.start('TitleMenu');
            } else {
                const errorText = await response.text();
                console.error('Error eliminando la cuenta:', errorText);
                this.add.text(755, 600, 'Error eliminando la cuenta. Inténtalo de nuevo.', {
                    fontFamily: 'retro-computer',
                    fontSize: '16px',
                    fill: '#ff0000'
                }).setDepth(2);
            }
        } catch (error) {
            console.error('Error al conectarse con el servidor:', error);
            this.add.text(755, 600, 'Error al conectarse con el servidor.', {
                fontFamily: 'retro-computer',
                fontSize: '16px',
                fill: '#ff0000'
            }).setDepth(2);
        }
    }

    startUserActivity() {
        const sendActivityLoop = () => {
            this.sendActivity(); // Actualizar la actividad del usuario
            this.time.delayedCall(1000, sendActivityLoop); // Llama cada 5 segundos usando Phaser
        };
        sendActivityLoop();
    }

    async fetchConnectedUsers() {

        this.fetchIntervalId = setInterval(async () => {
            try {
                const response = await fetch('/api/status/connected-users');
                if (response.ok) {
                    const data = await response.json();
                    const connectedUsers = data.connectedUsers;
                    this.updateUserCount(connectedUsers);
                } else {
                    console.error('Error fetching connected users:', response.statusText);
                    this.updateUserCount(0);
                }
            } catch (error) {
                console.error('Error connecting to server:', error);
                this.updateUserCount(0);
            }
        }, 1000);
    }

    updateUserCount(count) {
        if (this.userCountNum) {
            this.userCountNum.setText(count);
        } else {
            this.userCountNum = this.add.text(this.userCountText.x + this.userCountText.width + 10, this.userCountText.y, count, {
                fontFamily: 'retro-computer',
                fontSize: '16px',
                fill: '#ffffff'
            });
        }
    }

    sendActivity() {
        const userData = this.registry.get('userData'); // Obtener datos del usuario
        if (userData && userData.username) {
            fetch('/api/status/activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: userData.username })
            }).catch(error => {
                console.error('Error updating user activity:', error);
            });
        }
    }
    

    /*
    async serverStatus() {
        this.fetchIntervalId = setInterval(async () => {
            console.log("Checking the server status.");
            try {
                const response = await fetch('/api/status/connection'); // Llama al endpoint
                if (response.ok) {
                    const status = await response.text(); // El servidor devuelve un texto simple
                    this.updateServerStatus(status);
                } else {
                    this.updateServerStatus("Servidor no disponible");
                    console.error('Error fetching server status:', response.statusText);
                    this.scene.launch('ConnectionError', { originScene: 'MainMenuScene' }); // Cambiar a la escena de Error de conexión
                }
            } catch (error) {
                this.updateServerStatus("Error de conexión");
                console.error('Error connecting to server:', error);
                console.log("Launching error scene:");
                this.scene.pause();
                this.scene.launch('ConnectionError', { originScene: 'MainMenuScene' }); // Cambiar a la escena de Error de conexión
            }
        }, 1000);
    }
        */
    
    updateServerStatus(status) {
        // Elimina la imagen anterior si existe

        if(!status) {
            console.warn("Server offline!");
            this.scene.launch('ConnectionError', {originScene: this.scene.key});
            this.game.connectionManager.stopPolling();
            this.scene.pause(this.scene.key);
        } else {
            console.log("Server is online again!");
        }

        /*
        if (this.serverStatusImage) {
            this.serverStatusImage.destroy();
        }
    
        if(status) {
            this.serverStatusImage = this.add.image(this.serverStatusLabel.x + this.serverStatusLabel.width + 10, 368, 'online').setScale(0.8);
        } else {
            this.serverStatusImage = this.add.image(this.serverStatusLabel.x + this.serverStatusLabel.width + 10, 368, 'offline').setScale(0.8);
            this.game.connectionManager.stopPolling();
            console.log("Launching Connection Error scene...");
            this.launchConnectionErrorScene();
        }

        /*
        // Determina qué imagen mostrar según el estado
        const imageKey = status ? 'online' : 'offline';
    
        // Crear la imagen correspondiente justo al lado del texto
        this.serverStatusImage = this.add.image(this.serverStatusLabel.x + this.serverStatusLabel.width + 10, 368, imageKey).setScale(0.8);
        */
    }

    launchConnectionErrorScene() {
        if (this.scene.isActive('MainMenuScene')) {
            this.scene.pause('MainMenuScene');
            this.scene.launch('ConnectionError', { originScene: 'MainMenuScene' });
        }
    }

    clearAlerts() {
        // Borrar las alertas de la pantalla
        this.alertsOverlay.setVisible(false);
        this.eliminatedText.setVisible(false);
        this.invalidCredentialsText.setVisible(false);
    }

    async logoutUser() {
        console.log("Logging out...");
        const userData = this.registry.get('userData');
        if(userData && userData.username) {
            try {
                const response = await fetch(`/api/users/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: userData.username })
                });

                if(!response.ok) {
                    console.error('Error logging out:', await response.text());
                } else {
                    console.log('User logged out successfully:', userData.username);
                }
            } catch (error) {
                console.error('Error connecting to server:', error);
            }
        } else {
            console.warn('No user data in registry.');
        }

        this.registry.set('userData', null);
        this.game.connectionManager.setUsername(null);
        this.game.connectionManager.stopPolling();
    }
}

export default MainMenuScene;
