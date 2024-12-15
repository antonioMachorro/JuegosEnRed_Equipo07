class OptionsScene extends Phaser.Scene {
  constructor() {
      super({ key: "OptionsScene" });
  }

  init(data) {
    this.originScene = data.originScene;
  }

  preload(){
    this.load.image('marcoPause', './Interfaz/marcoPause.png');
}

  create() {
      this.interfaceFondoPause = this.add.image(960,500,'marcoPause').setScale(4);
      this.add.text(960, 200, "Menú de Opciones", {
          fontSize: "64px",
          fill: "#fff",
          fontFamily: "retro-computer"
      }).setOrigin(0.5);

      const initialVolume = this.game.audioManager.getVolume();

      // Mostrar el volumen actual
      this.volumeText = this.add.text(960, 400, `Volumen: ${Math.round(initialVolume * 100)}%`, {
          fontSize: "32px",
          fill: "#fff",
          fontFamily: "retro-computer"
      }).setOrigin(0.5);

      // Botón para bajar el volumen (a la izquierda)
      const decreaseButton = this.add.text(760, 500, "-", {
          fontSize: "64px",
          fill: "#f00",
          fontFamily: "retro-computer"
      }).setInteractive();

      decreaseButton.on("pointerdown", () => {
          this.changeVolume(-0.1); // Reduce el volumen en múltiplos de 5%
      });

      // Botón para subir el volumen (a la derecha)
      const increaseButton = this.add.text(1160, 500, "+", {
          fontSize: "64px",
          fill: "#0f0",
          fontFamily: "retro-computer"
      }).setInteractive();

      increaseButton.on("pointerdown", () => {
          this.changeVolume(0.1); // Aumenta el volumen en múltiplos de 5%
      });

      // Botón para volver al menú principal
      const backButton = this.add.text(960, 700, "Volver", {
          fontSize: "32px",
          fill: "#fff",
          fontFamily: "retro-computer"
      }).setOrigin(0.5).setInteractive();

      backButton.on("pointerdown", () => {
          this.scene.resume(this.originScene); // Regresa al menú principal
          this.scene.stop();
      });
  }

    /**
     * Cambia el volumen del juego
     * @param {number} delta Cambio incremental del volumen (positivo o negativo)
     */
    changeVolume(delta) {
        // Obtener el volumen actual
        const currentVolume = this.game.audioManager.getVolume();
        
        // Ajustar el volumen en pasos de 5% (0.05)
        const newVolume = Phaser.Math.Clamp(currentVolume + delta, 0, 1);

        // Actualizar el volumen en el AudioManager
        this.game.audioManager.setVolume(newVolume);

        // Mostrar el nuevo volumen como un porcentaje redondeado
        this.volumeText.setText(`Volume: ${Math.round(newVolume * 100)}%`);
    }
}

export default OptionsScene;
