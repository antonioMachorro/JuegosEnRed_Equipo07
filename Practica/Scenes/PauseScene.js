class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    preload(){
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
    }

    create() {
        const { width, height } = this.scale;

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xff176c, 0.3);
        this.overlay.fillRect(0, 0, width, height);


        this.interfaceFondoPause = this.add.image(960,500,'marcoPause').setScale(3);

        const pausedText = this.add.text(width / 2, 300, 'PAUSA', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5);

        const continueButton = this.add.text(width / 2, pausedText.y + 200, 'Continuar', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

        continueButton.on('pointerdown', () => {
            this.game.audioManager.setVolume(1);
            this.scene.resume('GameScene');
            this.scene.stop();
        });

        const optionsButton = this.add.text(width / 2, continueButton.y + 100, 'Opciones', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

        const stopButton = this.add.text(width / 2, optionsButton.y + 100, 'Salir', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

        optionsButton.on('pointerdown', () => {
            this.scene.pause();
            this.scene.launch('OptionsScene', { originScene: 'PauseScene' })
        });

        stopButton.on('pointerdown', () => {
            this.game.audioManager.setVolume(1);
            this.scene.stop('GameScene');
            this.registry.set('player1Rounds', 0);
            this.registry.set('player2Rounds', 0);
            this.registry.set('player1IsPolice', undefined);
            this.scene.start('MainMenuScene');
        });

        this.input.keyboard.on('keydown-ESC', () =>{
            this.game.audioManager.setVolume(1);
            this.scene.resume('GameScene');
            this.scene.stop();
        })
    }
}

export default PauseScene;
