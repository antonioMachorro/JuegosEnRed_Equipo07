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
    }

    create() {

        super.create();

        this.userCountText = null;
        this.serverStatusLabel = null;
        this.serverStatusImage = null;

        this.game.audioManager.playMusic('menu_music');

        this.Interfaz = this.add.image(960, 540, 'menuPrincipal');

        // Crear botones y hacerlos interactivos
        const playButton = this.add.image(750, 560, 'Jugar').setInteractive();
        const creditsButton = this.add.image(1275, 720, 'Creditos').setInteractive();
        const exitButton = this.add.image(750, 680, 'Salir').setInteractive();
        const optionsButton = this.add.image(772, 620, 'Opciones').setInteractive();

        // Configuración de la cámara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        // Configuración de los botones
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene'); // Cambiar a la escena de Créditos
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
        this.startUserActivity();
        this.fetchConnectedUsers();
        this.serverStatus();
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
                }
            } catch (error) {
                console.error('Error connecting to server:', error);
            }
        }, 1000);
    }

    updateUserCount(count) {
        if (this.userCountText) {
            this.userCountText.setText(`Usuarios conectados: ${count}`);
        } else {
            this.userCountText = this.add.text(615, 340, `Usuarios conectados: ${count}`, {
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
    

    async serverStatus() {
        this.fetchIntervalId = setInterval(async () => {
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
                this.scene.launch('ConnectionError', { originScene: 'MainMenuScene' }); // Cambiar a la escena de Error de conexión
            }
        }, 1000);
    }
    
    updateServerStatus(status) {
        // Verificar si el texto base ya existe, si no, crearlo
        if (!this.serverStatusLabel) {
            this.serverStatusLabel = this.add.text(615, 360, 'Estado del servidor:', {
                fontFamily: 'retro-computer',
                fontSize: '16px',
                fill: '#ffffff'
            });
        }
    
        // Elimina la imagen anterior si existe
        if (this.serverStatusImage) {
            this.serverStatusImage.destroy();
        }
    
        // Determina qué imagen mostrar según el estado
        const imageKey = status === "Connected to server." ? 'online' : 'offline';
    
        // Crear la imagen correspondiente justo al lado del texto
        this.serverStatusImage = this.add.image(870, 368, imageKey).setScale(0.8);
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
