class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload() {
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.image('iniciar', './Interfaz/iniciarboton.png');
        this.load.image('sesion', './Interfaz/iniciarsesion.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('noacc', './Interfaz/notengocuenta.png');
    }

    create() {
        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        // Fondo de la pantalla
        this.add.image(960, 540, 'menuPrincipal');
        this.add.image(960, 540, 'sesion');

        // Botón de iniciar sesión
        this.add.image(960, 580, 'iniciar')
            .setInteractive()
            .on('pointerdown', () => {
                const username = this.usernameField.value;
                const password = this.passwordField.value;
                this.validateLogin(username, password);
            });

        // Botón para crear cuenta
        this.add.image(960, 618, 'noacc')
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('CreateAccScene'); // Cambia a la escena 'CreateAccScene'
            });

        // Agregar los campos de texto para el nombre de usuario y la contraseña
        this.createLoginFields();

        // Limpiar campos cuando la escena se cierra
        this.events.on('shutdown', this.cleanUp, this);
    }

    createLoginFields() {
        this.usernameField = document.createElement('input');
        this.usernameField.id = 'username-input';
        this.usernameField.placeholder = 'Usuario';
        this.setStyle(this.usernameField, '40.5%');
        document.body.appendChild(this.usernameField);

        this.passwordField = document.createElement('input');
        this.passwordField.id = 'password-input';
        this.passwordField.placeholder = 'Contraseña';
        this.passwordField.type = 'password';
        this.setStyle(this.passwordField, '51.5%');
        document.body.appendChild(this.passwordField);
    }

    setStyle(field, top) {
        field.style.position = 'absolute';
        field.style.left = '48.6%';
        field.style.top = top;
        field.style.transform = 'translate(-50%, -50%)';
        field.style.fontSize = '16px';
        field.style.padding = '8px';
        field.style.width = '298px';
        field.style.height = '31px';
    }

    validateLogin(username, password) {
        fetch(`/api/users/${username}`)
            .then(response => {
                if (!response.ok) throw new Error('Usuario no encontrado');
                return response.json();
            })
            .then(data => {
                if (data.username === username && data.password === password) {
                    this.scene.start('MainMenuScene');
                } else {
                    alert('Contraseña incorrecta');
                }
            })
            .catch(error => {
                alert('Usuario no encontrado');
            });
    }

    cleanUp() {
        // Eliminar campos de texto al salir de la escena
        if (this.usernameField) {
            document.body.removeChild(this.usernameField);
            this.usernameField = null;
        }
        if (this.passwordField) {
            document.body.removeChild(this.passwordField);
            this.passwordField = null;
        }
    }
}

export default LoginScene;
