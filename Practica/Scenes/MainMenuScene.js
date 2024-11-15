class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar la imagen del botón
        this.load.image('boton', 'Interfaz/boton.png');
    }

    create() {
        // Añadir la imagen del botón y hacerla interactiva
        const playButton = this.add.image(900, 500, 'boton')
            .setOrigin(0.5)
            .setInteractive();

        // Escuchar el evento de clic en el botón
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default MainMenuScene