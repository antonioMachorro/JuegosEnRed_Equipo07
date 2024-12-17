class OptionsScene extends Phaser.Scene {
    constructor() {
      super({ key: "OptionsScene" });
      this.currentPassword = "contraseñaActual"; // Ejemplo de contraseña actual
    }
  
    init(data) {
      this.originScene = data.originScene;
    }
  
    preload() {
      this.load.image("marcoPause", "./Interfaz/marcoPause.png");
      this.load.image("volver", "./Interfaz/volver.png");
      this.load.image("confirmar", "./Interfaz/guardarOpciones.png");
    }
  
    create() {
      // Fondo del menú de opciones
      this.interfaceFondoPause = this.add
        .image(960, 500, "marcoPause")
        .setScale(4);
  
      // Título del menú de opciones
      this.add
        .text(960, 200, "Menú de Opciones", {
          fontSize: "64px",
          fill: "#fff",
          fontFamily: "retro-computer",
        })
        .setOrigin(0.5);
  
      // Mostrar el volumen actual
      const initialVolume = this.game.audioManager.getVolume();
      this.volumeText = this.add
        .text(960, 400, `Volumen: ${Math.round(initialVolume * 100)}%`, {
          fontSize: "32px",
          fill: "#fff",
          fontFamily: "retro-computer",
        })
        .setOrigin(0.5);
  
      // Botón para bajar el volumen (a la izquierda)
      const decreaseButton = this.add
        .text(720, 360, "-", {
          fontSize: "64px",
          fill: "#f00",
          fontFamily: "retro-computer",
        })
        .setInteractive();
  
      decreaseButton.on("pointerdown", () => {
        this.changeVolume(-0.1); // Reduce el volumen en múltiplos de 10%
      });
  
      // Botón para subir el volumen (a la derecha)
      const increaseButton = this.add
        .text(1170, 360, "+", {
          fontSize: "64px",
          fill: "#0f0",
          fontFamily: "retro-computer",
        })
        .setInteractive();
  
      increaseButton.on("pointerdown", () => {
        this.changeVolume(0.1); // Aumenta el volumen en múltiplos de 10%
      });
  
      // Campo de texto para cambiar la contraseña
      this.add
        .text(860, 540, "Cambiar Contraseña:", {
          fontSize: "32px",
          fill: "#fff",
          fontFamily: "retro-computer",
        })
        .setOrigin(1, 0.5);
  
      this.passwordField = this.createPasswordField();
  
      // Botón para guardar cambios y verificar la contraseña
      const confirmButton = this.add
        .image(960, 615, "confirmar")
        .setScale(1.4)
        .setOrigin(0.5)
        .setInteractive();
  
      confirmButton.on("pointerdown", () => {
        const newPassword = this.passwordField.value;
        this.checkAndSavePassword(newPassword);
      });
  
      // Botón para volver a la escena anterior
      const returnButton = this.add
        .image(960, 720, "volver")
        .setScale(1.4)
        .setOrigin(0.5)
        .setInteractive();
  
      returnButton.on("pointerdown", () => {
        this.scene.resume(this.originScene); // Regresa a la escena original
        this.scene.stop(); // Detiene esta escena
      });
    }
  
    /**
     * Cambia el volumen del juego
     * @param {number} delta Cambio incremental del volumen (positivo o negativo)
     */
    changeVolume(delta) {
      const currentVolume = this.game.audioManager.getVolume();
      const newVolume = Phaser.Math.Clamp(currentVolume + delta, 0, 1);
      this.game.audioManager.setVolume(newVolume);
      this.volumeText.setText(`Volumen: ${Math.round(newVolume * 100)}%`);
    }
  
    /**
     * Crea un campo de texto HTML para la contraseña
     * @returns {HTMLInputElement} El elemento HTML del campo de texto
     */
    createPasswordField() {
      const passwordField = document.createElement("input");
      passwordField.type = "password";
      passwordField.placeholder = "Nueva contraseña";
      passwordField.style.position = "absolute";
      passwordField.style.left = "880px"; // Ajustar posición horizontal
      passwordField.style.top = "360px"; // Ajustar posición vertical
      passwordField.style.transform = "translate(-50%, -50%)";
      passwordField.style.fontSize = "16px";
      passwordField.style.padding = "8px";
      passwordField.style.width = "300px";
      passwordField.style.height = "30px";
      passwordField.style.border = "1px solid #fff";
      passwordField.style.backgroundColor = "#000";
      passwordField.style.color = "#fff";
      passwordField.style.outline = "none";
  
      document.body.appendChild(passwordField);
  
      this.events.on("shutdown", () => {
        if (passwordField) {
          passwordField.remove(passwordField);
        }
      });
  
      return passwordField;
    }
  
    /**
     * Verifica y guarda la nueva contraseña ingresada
     * @param {string} newPassword La nueva contraseña ingresada
     */
    checkAndSavePassword(newPassword) {
      if (!newPassword) {
        alert("Por favor, ingresa una nueva contraseña.");
        return;
      }
  
      if (newPassword === this.currentPassword) {
        alert("La contraseña ingresada ya está configurada.");
        return;
      }
  
      this.currentPassword = newPassword;
      alert("Nueva contraseña guardada correctamente.");
    }
  }
  
  export default OptionsScene;
  