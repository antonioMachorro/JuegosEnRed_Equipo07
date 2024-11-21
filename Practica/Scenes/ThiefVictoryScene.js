class ThiefVictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ThiefVictoryScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width/2, 250, '¡Ha ganado el ladrón!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(width/2, 350, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default ThiefVictoryScene