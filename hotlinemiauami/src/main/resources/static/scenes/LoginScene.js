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
          const username = this.usernameField.value;
          const password = this.passwordField.value;
          this.validateLogin(username, password);
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

    //
    this.loadingOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
    this.loadingOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.loadingOverlay.setDepth(10);
    this.loadingOverlay.setVisible(false);

    // Loading...
    this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY+170, 'Loading...', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
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
      if(userExistsResponse.ok) {
        const users = await userExistsResponse.json();
        if(users.connectedUsers.includes(username)) {
          alert("User is already logged in.");
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

        this.registry.set("userData", { username: data.username });
        this.game.connectionManager.setUsername(data.username);
        this.game.connectionManager.startPolling();

        this.scene.start("MainMenuScene");
      } else if (response.status === 404) {
        alert("User not found.");
      } else if (response.status === 401) {
        alert("Invalid credentials.");
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
