class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar las imágenes y música
        this.load.image('Jugar', './Interfaz/Jugar.png');
        this.load.image('Opciones', './Interfaz/Opciones.png');
        this.load.image('Salir', './Interfaz/Salir.png');
        this.load.image('Creditos', './Interfaz/Creditos.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');

        this.load.audio('menu_music', './Musica/MENUU.wav');
    }

    create() {
        this.game.audioManager.playMusic('menu_music');

        this.Interfaz = this.add.image(960, 540, 'menuPrincipal');

        // Crear botones y hacerlos interactivos
        const playButton = this.add.image(750, 560, 'Jugar').setInteractive();
        const creditsButton = this.add.image(1275, 720, 'Creditos').setInteractive();
        const exitButton = this.add.image(750, 680, 'Salir').setInteractive();
        const optionsButton = this.add.image(772, 620, 'Opciones').setInteractive();

        // Configuración de la cámara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        // Configuración de los botones
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene'); // Cambiar a la escena de Créditos
        });

        playButton.on('pointerdown', () => {
            this.scene.start('GameModeScene'); // Cambiar a la escena de modo de juego
        });

        optionsButton.on('pointerdown', () => {
            this.scene.launch('OptionsScene', { originScene: 'MainMenuScene' }); // Cambiar a la escena de opciones
            this.scene.pause();
        });

        exitButton.on('pointerdown', () => {
            this.scene.start('TitleMenu'); // Cambiar a la escena TitleMenu
        });

    }
}

export default MainMenuScene;
