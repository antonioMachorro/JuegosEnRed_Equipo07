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

        this.events.on('shutdown', this.removeFields, this);

        const returnButton = this.add.image(960,720, 'volver')
        .setScale(0.6)
        .setOrigin(0.5)
        .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('LoginScene');
        });

        returnButton.y = 650;

    }

    createAccountFields() {
        this.usernameField = document.createElement('input');
        this.usernameField.id = 'username-input';
        this.usernameField.placeholder = 'Usuario';
        this.usernameField.style.position = 'absolute';
        this.usernameField.style.left = '598px';
        this.usernameField.style.top = '317px';
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
        this.passwordField.style.left = '598px';
        this.passwordField.style.top = '400px';
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

    createAccount(username, password) {
        // Verificar si el nombre de usuario ya existe
        fetch(`/api/users/${username}`)
            .then(response => {
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
                    fetch('/api/users/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Cuenta creada con éxito.');
                            // Cambiamos de escena
                            this.scene.start('LoginScene');
                        } else {
                            alert('Hubo un error al crear la cuenta. Inténtalo de nuevo.');
                        }
                    })
                    .catch(error => {
                        alert('Error en la conexión con el servidor.');
                    });
                }
            })
            .catch(error => {
                alert('Error al verificar el nombre de usuario.');
            });
    }
}

export default CreateAccScene;
