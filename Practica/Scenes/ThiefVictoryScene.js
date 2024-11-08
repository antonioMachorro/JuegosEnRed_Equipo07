class ThiefVictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ThiefVictoryScene' });
    }

    create() {
        this.add.text(400, 250, '¡Ha ganado el ladrón!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(400, 350, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default ThiefVictoryScene