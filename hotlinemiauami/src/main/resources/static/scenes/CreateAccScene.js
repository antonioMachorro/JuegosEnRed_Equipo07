class CreateAccScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreateAccScene' });
    }

    preload() {
        this.load.image('crearCuenta', './Interfaz/crearcuenta.png');
        this.load.image('crearboton', './Interfaz/crearboton.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
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

        // Crear los campos de texto para nombre de usuario y contraseña
        this.createAccountFields();
    }

    createAccountFields() {
        // Crear un campo de texto para el nombre de usuario en una coordenada específica
        const usernameField = document.createElement('input');
        usernameField.id = 'username-input';
        usernameField.placeholder = 'es este';
        usernameField.style.position = 'absolute';
        usernameField.style.left = '598px';
        usernameField.style.top = '312px';
        usernameField.style.fontSize = '16px';
        usernameField.style.padding = '8px';
        usernameField.style.width = '298px';
        usernameField.style.height = '31px';
        document.body.appendChild(usernameField);

        // Crear un campo de texto para la contraseña en una coordenada específica
        const passwordField = document.createElement('input');
        passwordField.id = 'password-input';
        passwordField.placeholder = 'aqui la contraseña';
        passwordField.type = 'password';
        passwordField.style.position = 'absolute';
        passwordField.style.left = '598px';
        passwordField.style.top = '394px';
        passwordField.style.fontSize = '16px';
        passwordField.style.padding = '8px';
        passwordField.style.width = '298px';
        passwordField.style.height = '31px';
        document.body.appendChild(passwordField);
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
                            this.scene.start('LoginScene'); // Volver a la escena de login después de crear la cuenta
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
