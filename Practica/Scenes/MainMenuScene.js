class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar la imagen del botón
        this.load.image('boton', 'Interfaz/boton.png');
    }

    create() {
        const { width, height } = this.scale;

        const title = this.add.text(0, 0, 'HOTLINE MIAUMI', { fontFamily: 'retro-computer', fontSize: '64px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        title.setPosition(width / 2, height / 10);

        // Añadir la imagen del botón y hacerla interactiva
        const playButton = this.add.image(width/2, height/2.5, 'boton')
            .setOrigin(0.5)
            .setScale(0.5)
            .setInteractive();

        // Escuchar el evento de clic en el botón
        playButton.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });

        const creditsButton = this.add.image(width/2, height/1.5, 'boton')
            .setOrigin(0.5)
            .setScale(0.5)
            .setTint(0xff7d7d)
            .setInteractive();
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene');
        })
    }
}

export default MainMenuScene