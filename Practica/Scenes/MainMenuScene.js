class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar la imagen del botón
        this.load.image('boton', './Interfaz/boton.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');

        this.load.audio('menu_music', './Musica/MENUU.wav');
    }

    create() {
        this.game.audioManager.playMusic('menu_music');

        this.Interfaz = this.add.image(960, 540,'menuPrincipal');

        const { width, height } = this.scale;

        const title = this.add.text(0, 0, 'HOTLINE MIAUMI', { fontFamily: 'retro-computer', fontSize: '64px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // Añadir la imagen del botón y hacerla interactiva
        const playButton = this.add.image(400,700, 'boton')
            .setOrigin(0.5)
            .setInteractive();
    
        const creditsButton = this.add.image(width/2, height/1.5, 'boton')
            .setOrigin(0.5)
            .setInteractive();
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene');
        })

        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        title.setPosition(width / 2, height / 10);


        // Escuchar el evento de clic en el botón
        playButton.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });

        
    }
}

export default MainMenuScene