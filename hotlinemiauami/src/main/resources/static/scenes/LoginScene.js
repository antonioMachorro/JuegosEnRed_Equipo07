class LoginScene extends Phaser.Scene {
  constructor() {
    super({ key: "LoginScene" });
  }

  preload() {
    this.load.image("menuPrincipal", "./Interfaz/menuPrincipal.png");
    this.load.image("iniciar", "./Interfaz/iniciarboton.png");
    this.load.image("sesion", "./Interfaz/iniciarsesion.png");
    this.load.image("volver", "./Interfaz/volver.png");
    this.load.image("noacc", "./Interfaz/notengocuenta.png");
  }

  create() {

    // Camara
    const camera = this.cameras.main;
    camera.setBounds(370, 210, 960, 540);
    camera.setZoom(2.6);

    // Fondo de la pantalla
    this.add.image(960, 540, "menuPrincipal");
    this.add.image(960, 540, "sesion");

    // Botón de iniciar sesión
    this.loginButton = this.add
      .image(960, 580, "iniciar")
      .setInteractive()
      .on("pointerdown", () => {
        this.clearAlerts();
        const username = this.usernameField.value;
        const password = this.passwordField.value;

        if (username && password) {
          this.validateLogin(username, password);
        } else {
          this.pleaseIntroduceText.setVisible(true);
          this.alertsOverlay.setVisible(true);
        }

      });

    // Botón para crear cuenta
    this.add
      .image(960, 618, "noacc")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("CreateAccScene"); // Cambia a la escena 'CreateAccScene'
      });

    const returnButton = this.add
      .image(960, 720, "volver")
      .setScale(0.6)
      .setOrigin(0.5)
      .setInteractive();
    returnButton.on("pointerdown", () => {
      this.scene.start("TitleMenu");
    });

    returnButton.y = 675;

    // Overlay mensajes
    this.alertsOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.65 } });
    this.alertsOverlay.fillRect(this.cameras.main.centerX - 400, this.cameras.main.centerY + 150, 800, 40);
    this.alertsOverlay.setDepth(10);
    this.alertsOverlay.setVisible(false);

    // Overlay Cargando
    this.loadingOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
    this.loadingOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.loadingOverlay.setDepth(10);
    this.loadingOverlay.setVisible(false);

    // Mensaje Cargando
    this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Cargando...', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    // Mensaje Por favor...
    this.pleaseIntroduceText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Por favor, ingresa un nombre de usuario y una contraseña', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    // Mensaje usuario ya loggeado
    this.alreadyLoggedText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'El usuario ya ha iniciado sesión', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    // Mensaje Usuario no encontrado
    this.notFoundText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Usuario no encontrado', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
      .setOrigin(0.5)
      .setDepth(11)
      .setVisible(false);

    // Mensaje Credenciales invalidas
    this.invalidCredentialsText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Credenciales inválidas', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
    .setOrigin(0.5)
    .setDepth(11)
    .setVisible(false);

    // Agregar los campos de texto para el nombre de usuario y la contraseña
    this.createLoginFields();

    // Limpiar campos cuando la escena se cierra
    this.events.on("shutdown", this.cleanUp, this);
  }

  createLoginFields() {
    this.usernameField = document.createElement("input");
    this.usernameField.id = "username-input";
    this.usernameField.placeholder = "Usuario";
    this.setStyle(this.usernameField, "40.5%");
    document.body.appendChild(this.usernameField);

    this.passwordField = document.createElement("input");
    this.passwordField.id = "password-input";
    this.passwordField.placeholder = "Contraseña";
    this.passwordField.type = "password";
    this.setStyle(this.passwordField, "51.5%");
    document.body.appendChild(this.passwordField);
  }

  setStyle(field, top) {
    field.style.position = "absolute";
    field.style.left = "48.6%";
    field.style.top = top;
    field.style.transform = "translate(-50%, -50%)";
    field.style.fontSize = "16px";
    field.style.padding = "8px";
    field.style.width = "298px";
    field.style.height = "31px";
  }

  async validateLogin(username, password) {

    this.showLoading(true);

    try {

      const userExistsResponse = await fetch("/api/status/users");
      if (userExistsResponse.ok) {
        const users = await userExistsResponse.json();
        if (users.connectedUsers.includes(username)) {
          this.alertsOverlay.setVisible(true);
          this.alreadyLoggedText.setVisible(true);
          return;
        }
      } else {
        alert("Error fetching users.")
        throw new Error("An error ocurred during fetching users.");
      }

      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data.message);

        window.currentUsername = data.username;
        this.registry.set("currentVolume", data.volume);


        // Configurar el volumen en el AudioManager
        const volume = data.volume / 100; // Convertir 0-100 a 0-1
        this.game.audioManager.setVolume(volume);
        console.log("Volumen aplicado en el juego:", volume);

        this.registry.set("userData", { username: data.username });
        this.game.connectionManager.setUsername(data.username);

        this.game.connectionManager.startPolling(1000);

        this.scene.start("MainMenuScene");
      } else if (response.status === 404) {
        this.alertsOverlay.setVisible(true);
        this.notFoundText.setVisible(true);
      } else if (response.status === 401) {
        this.alertsOverlay.setVisible(true);
        this.invalidCredentialsText.setVisible(true);
      } else {
        throw new Error("Invalid response.");
      }

    } catch (error) {
      console.error("Error during login:", error);
      return "An error occurred during login";
    } finally {
      this.showLoading(false);
    }
  }

  clearAlerts() {
    this.alertsOverlay.setVisible(false);
    this.notFoundText.setVisible(false);
    this.alreadyLoggedText.setVisible(false);
    this.pleaseIntroduceText.setVisible(false);
    this.invalidCredentialsText.setVisible(false);
  }

  showLoading(visible) {
    this.loadingOverlay.setVisible(visible);
    this.loadingText.setVisible(visible);
    this.loginButton.setActive(!visible);
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
