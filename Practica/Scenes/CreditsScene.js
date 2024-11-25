class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width/2, 250, 'CREDITOS', { fontFamily: 'retro-computer', fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(150, height - 100, 'REGRESAR', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default CreditsScene