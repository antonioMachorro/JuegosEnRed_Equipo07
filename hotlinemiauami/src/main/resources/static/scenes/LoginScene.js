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
                // Obtener los valores de usuario y contraseña
                const username = document.getElementById('username-input').value;
                const password = document.getElementById('password-input').value;

                // Llamada al backend para validar las credenciales
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
    }

    createLoginFields() {
        // Crear un campo de texto para el nombre de usuario
        const usernameField = document.createElement('input');
        usernameField.id = 'username-input';
        usernameField.placeholder = 'Usuario';
        usernameField.style.position = 'absolute';
        usernameField.style.left = '48.6%';
        usernameField.style.top = '40.5%';
        usernameField.style.transform = 'translate(-50%, -50%)';  // Centrado exacto
        usernameField.style.fontSize = '16px';  // Tamaño de fuente más pequeño
        usernameField.style.padding = '8px';    // Menos espacio dentro del campo
        usernameField.style.width = '298px';    // Ancho reducido
        usernameField.style.height = '31px';    // Altura reducida
        document.body.appendChild(usernameField);

        // Crear un campo de texto para la contraseña
        const passwordField = document.createElement('input');
        passwordField.id = 'password-input';
        passwordField.placeholder = 'Buenas';
        passwordField.type = 'password';
        passwordField.style.position = 'absolute';
        passwordField.style.left = '48.6%';
        passwordField.style.top = '51.5%';  // Asegurarse que esté debajo del campo de usuario
        passwordField.style.transform = 'translate(-50%, -50%)';  // Centrado exacto
        passwordField.style.fontSize = '16px';  // Tamaño de fuente más pequeño
        passwordField.style.padding = '8px';    // Menos espacio dentro del campo
        passwordField.style.width = '298px';    // Ancho reducido
        passwordField.style.height = '31px';    // Altura reducida
        document.body.appendChild(passwordField);
    }

    validateLogin(username, password) {
        // Hacer una solicitud al backend para validar las credenciales
        fetch(`/api/users/${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Usuario no encontrado');
                }
                return response.json();
            })
            .then(data => {
                if (data.username === username && data.password === password) {
                    this.scene.start('MainMenuScene');  // Cambiar a la escena 'MainMenuScene'
                } else {
                    alert('Contraseña incorrecta');
                }
            })
            .catch(error => {
                alert('Usuario no encontrado');
            });
    }
}

export default LoginScene;
