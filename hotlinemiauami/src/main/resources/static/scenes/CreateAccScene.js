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
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;

                if (username && password) {
                    this.createAccount(username, password);
                } else {
                    alert('Por favor, ingresa un nombre de usuario y una contraseña.');
                }
            });

        // Crear los campos de texto
        this.createAccountFields();

        this.loadingOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
        this.loadingOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.loadingOverlay.setDepth(10);
        this.loadingOverlay.setVisible(false);
    
        // Loading...
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY+170, 'Loading...', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
          .setOrigin(0.5)
          .setDepth(11)
          .setVisible(false);

        this.events.on('shutdown', this.removeFields, this);

        const returnButton = this.add.image(960,660, 'volver')
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

    async createAccount(username, password) {
        this.showLoading(true);
        // Verificar si el nombre de usuario ya existe
        try {
            const response = await fetch(`/api/users/${username}`);
                if (response.ok) {
                    // Si el usuario ya existe
                    alert('El nombre de usuario ya está en uso.');
                } else {
                    // Crear el usuario si no existe
                    const newUser = {
                        username: username,
                        password: password,
                        volume:100,
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
                    if(createResponse.ok) {
                        alert('Cuenta creada con éxito.');
                        this.scene.start('LoginScene');
                    } else {
                        alert('Hubo un error al crear la cuenta. Inténtalo de nuevo.');
                    }
                }
        } catch (error) {
            console.error("Error during creation:", error);
            alert("Error de conexión.");
        } finally  {
            this.showLoading(false);
        }
    }
}

export default CreateAccScene;
