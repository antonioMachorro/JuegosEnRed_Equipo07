class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xff176c, 0.3);
        this.overlay.fillRect(0, 0, width, height);

        const pausedText = this.add.text(width / 2, 300, 'PAUSED', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5);

        const continueButton = this.add.text(width / 2, pausedText.y + 200, 'CONTINUE', {
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

        const stopButton = this.add.text(width / 2, continueButton.y + 150, 'QUIT', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

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
