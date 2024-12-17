import BaseScene from "./BaseScene.js";

class LoginScene extends BaseScene {
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
    super.create();

    // Camara
    const camera = this.cameras.main;
    camera.setBounds(370, 210, 960, 540);
    camera.setZoom(2.6);

    // Fondo de la pantalla
    this.add.image(960, 540, "menuPrincipal");
    this.add.image(960, 540, "sesion");

    // Botón de iniciar sesión
    this.add
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
    console.log(username);
    console.log(password);
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log(data.message);

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
    }
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
