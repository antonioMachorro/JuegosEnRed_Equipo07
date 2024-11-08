class PoliceVictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PoliceVictoryScene' });
    }

    create() {
        this.add.text(400, 250, '¡Ha ganado el policía!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(400, 350, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default PoliceVictoryScene