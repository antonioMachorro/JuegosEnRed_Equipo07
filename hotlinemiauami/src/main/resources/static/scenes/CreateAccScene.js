class CreateAccScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreateAccScene' });

        // Agrega variables para guardar referencias a los campos
        this.usernameField = null;
        this.passwordField = null;
    }

    preload() {
        this.load.image('crearCuenta', './Interfaz/crearcuenta.png');
        this.load.image('crearboton', './Interfaz/crearboton.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {
        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        this.add.image(960, 540, 'menuPrincipal');
        this.add.image(960, 540, 'crearCuenta');

        // Botón de crear cuenta
        this.add.image(962, 600, 'crearboton')
            .setInteractive()
            .on('pointerdown', () => {
                this.clearAlerts();
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;

                if (username && password) {
                    this.createAccount(username, password);
                } else {
                    this.pleaseIntroduceText.setVisible(true);
                    this.alertsOverlay.setVisible(true);
                }
            });

        // Crear los campos de texto
        this.createAccountFields();

        // Overlay mensajes
        this.alertsOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.65 } });
        this.alertsOverlay.fillRect(this.cameras.main.centerX-400, this.cameras.main.centerY + 140, 800, 60);
        this.alertsOverlay.setDepth(10);
        this.alertsOverlay.setVisible(false);

        // Overlay loading
        this.loadingOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
        this.loadingOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.loadingOverlay.setDepth(10);
        this.loadingOverlay.setVisible(false);

        // Mensaje Por favor...
        this.pleaseIntroduceText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Por favor, ingresa un nombre de usuario y una contraseña', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);

        // Mensaje Cargando...
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Cargando...', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);

        // Mensaje Usuario en uso...
        this.usedUserText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'El nombre de usuario ya está en uso', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);

        // Mensaje Error al crear cuenta
        this.createErrorText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Hubo un error al crear la cuenta. Inténtalo de nuevo.', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);

        // Mensaje Cuenta creada
        this.successAccountText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, '¡Cuenta creada con éxito!', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(11)
            .setVisible(false);


        this.events.on('shutdown', this.removeFields, this);

        const returnButton = this.add.image(960, 660, 'volver')
            .setScale(0.6)
            .setOrigin(0.5)
            .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('LoginScene');
        });

    }

    createAccountFields() {
        this.usernameField = document.createElement('input');
        this.usernameField.id = 'username-input';
        this.usernameField.placeholder = 'Usuario';
        this.usernameField.style.position = 'absolute';
        this.usernameField.style.left = '39.5%';
        this.usernameField.style.top = '44%';
        this.usernameField.style.fontSize = '16px';
        this.usernameField.style.padding = '8px';
        this.usernameField.style.width = '298px';
        this.usernameField.style.height = '31px';
        document.body.appendChild(this.usernameField);

        // Crear un campo de texto para la contraseña
        this.passwordField = document.createElement('input');
        this.passwordField.id = 'password-input';
        this.passwordField.placeholder = 'Contraseña';
        this.passwordField.type = 'password';
        this.passwordField.style.position = 'absolute';
        this.passwordField.style.left = '39.5%';
        this.passwordField.style.top = '55%';
        this.passwordField.style.fontSize = '16px';
        this.passwordField.style.padding = '8px';
        this.passwordField.style.width = '298px';
        this.passwordField.style.height = '31px';
        document.body.appendChild(this.passwordField);
    }

    removeFields() {
        // Eliminar los campos del DOM si existen
        if (this.usernameField && this.usernameField.parentNode) {
            this.usernameField.parentNode.removeChild(this.usernameField);
            this.usernameField = null;
        }

        if (this.passwordField && this.passwordField.parentNode) {
            this.passwordField.parentNode.removeChild(this.passwordField);
            this.passwordField = null;
        }
    }

    showLoading(visible) {
        console.log("Showing visible...");
        this.loadingOverlay.setVisible(visible);
        this.loadingText.setVisible(visible);
    }

    clearAlerts() {
        // Borrar las alertas de la pantalla
        this.loadingOverlay.setVisible(false);
        this.loadingText.setVisible(false);
        this.usedUserText.setVisible(false);
        this.createErrorText.setVisible(false);
        this.successAccountText.setVisible(false);
        this.pleaseIntroduceText.setVisible(false);
        this.alertsOverlay.setVisible(false);
    }

    async createAccount(username, password) {
        this.showLoading(true);
        // Verificar si el nombre de usuario ya existe
        try {
            const response = await fetch(`/api/users/${username}`);
            if (response.ok) {
                // Si el usuario ya existe
                this.alertsOverlay.setVisible(true);
                this.usedUserText.setVisible(true);
            } else {
                // Crear el usuario si no existe
                const newUser = {
                    username: username,
                    password: password,
                    volume: 100,
                    lastSeen: Date.now()
                };

                // Enviar solicitud para crear el usuario
                const createResponse = await fetch('/api/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)
                });
                if (createResponse.ok) {
                    this.alertsOverlay.setVisible(true);
                    this.successAccountText.setVisible(true);
                    setTimeout(() => {
                        this.scene.start('LoginScene');
                    }, 2000);
                } else {
                    this.alertsOverlay.setVisible(true);
                    this.createErrorText.setVisible(true);
                }
            }
        } catch (error) {
            console.error("Error during creation:", error);
            alert("Error de conexión.");
        } finally {
            this.showLoading(false);
        }
    }
}

export default CreateAccScene;
