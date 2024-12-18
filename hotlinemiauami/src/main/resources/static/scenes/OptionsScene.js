class OptionsScene extends Phaser.Scene {
  constructor() {
      super({ key: "OptionsScene" });
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
          this.handleSave();
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
      passwordField.style.top = "540px"; // Ajustar posición vertical
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
              passwordField.remove();
          }
      });

      return passwordField;
  }

  /**
   * Maneja la lógica de guardar ajustes
   */
  handleSave() {
      const newPassword = this.passwordField.value.trim();
      const newVolume = Math.round(this.game.audioManager.getVolume() * 100);

      // Obtener el volumen actual mostrado
      const displayedVolume = Math.round(this.game.audioManager.getVolume() * 100);

      // Obtener el usuario actual (suponiendo que lo tienes almacenado globalmente)
      const currentUsername = window.currentUsername;

      // Verificar si se ha cambiado el volumen
      // En este caso, ya que el volumen se actualiza en tiempo real, asumimos que siempre se ha cambiado si el volumen mostrado es diferente al inicial
      // Si tienes una variable para almacenar el volumen inicial, puedes usarla para comparar
      // Por simplicidad, aquí asumimos que si el volumen actual es diferente de 100 (valor por defecto), se ha cambiado
      const initialVolume = 100; // Puedes obtener este valor de otra manera si es necesario
      const isVolumeChanged = newVolume !== initialVolume;

      // Verificar si se ha ingresado una nueva contraseña
      const isPasswordChanged = newPassword.length > 0;

      if (!isPasswordChanged && !isVolumeChanged) {
          alert("No has realizado ningún cambio.");
          return;
      }

      // Construir el objeto de actualización
      const updateData = {};
      if (isPasswordChanged) {
          updateData.password = newPassword;
      }
      if (isVolumeChanged) {
          updateData.volume = newVolume;
      }

      // Realizar la solicitud PUT al backend
      fetch(`/api/users/${encodeURIComponent(currentUsername)}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
      })
      .then(response => {
          if (response.ok) {
              alert("Ajustes guardados con éxito.");

              // Actualizar el volumen del juego si se ha cambiado
              if (isVolumeChanged) {
                  this.game.audioManager.setVolume(newVolume / 100);
                  this.volumeText.setText(`Volumen: ${newVolume}%`);
              }

              // Limpiar el campo de contraseña
              this.passwordField.value = '';
          } else if (response.status === 404) {
              alert("Usuario no encontrado.");
          } else {
              response.text().then(text => {
                  alert(`Error al guardar ajustes: ${text}`);
              });
          }
      })
      .catch(error => {
          console.error("Error al guardar ajustes:", error);
          alert("Error de conexión con el servidor.");
      });
  }

  shutdown() {
      // Eliminar los campos del DOM al salir de la escena
      if (this.passwordField && this.passwordField.parentNode) {
          this.passwordField.parentNode.removeChild(this.passwordField);
      }
  }

  // Opcional: Llamar a shutdown al cerrar la escena
  init(data) {
      this.events.on("shutdown", this.shutdown, this);
  }
}

export default OptionsScene;
