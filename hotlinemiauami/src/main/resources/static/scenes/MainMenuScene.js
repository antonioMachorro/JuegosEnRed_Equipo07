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
        this.load.image("marcoPause", "./Interfaz/marcoPause.png");
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
        const deleteButton = this.add.image(1225, 720, 'borrar').setInteractive().setScale(0.1);

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

        deleteButton.on('pointerdown', () => {
            // Mostrar el marco de confirmación
            const marco = this.add.image(960, 540, 'marcoPause').setDepth(1); // Asegurarnos de que esté encima de otros elementos
        
            // Agregar el texto de confirmación
            const confirmText = this.add.text(755, 500, '¿Quieres borrar la cuenta?', {
                fontFamily: 'retro-computer',
                fontSize: '20px',
                fill: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }).setDepth(2);
        
            // Crear botones para "Sí" y "No"
            const yesButton = this.add.text(980, 570, 'Sí', {
                fontFamily: 'retro-computer',
                fontSize: '18px',
                fill: '#00ff00'
            }).setInteractive().setDepth(2);
        
            const noButton = this.add.text(880, 570, 'No', {
                fontFamily: 'retro-computer',
                fontSize: '18px',
                fill: '#ff0000'
            }).setInteractive().setDepth(2);
        
            // Acción para "Sí"
            yesButton.on('pointerdown', async () => {
                await this.logoutUser();
                marco.destroy();
                confirmText.destroy();
                yesButton.destroy();
                noButton.destroy();
                this.scene.start('TitleMenu'); // Regresar al menú principal o escena inicial
                
            });
        
            // Acción para "No"
            noButton.on('pointerdown', () => {
                marco.destroy();
                confirmText.destroy();
                yesButton.destroy();
                noButton.destroy();
            });
        });
        

        this.startUserActivity();
        this.fetchConnectedUsers();
        this.serverStatus();
        this.deleteButton();
    }

    async deleteButton() {
        try {
            // Obtener datos del usuario del registro
            const userData = this.registry.get('userData');
            if (!userData || !userData.username) {
                console.warn('No hay datos de usuario en el registro.');
                return;
            }
    
            // Llamar al backend para borrar al usuario
            const response = await fetch('/api/users/delete', {
                method: 'DELETE',
            });
    
            if (response.ok) {
                console.log('Cuenta eliminada exitosamente');
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
