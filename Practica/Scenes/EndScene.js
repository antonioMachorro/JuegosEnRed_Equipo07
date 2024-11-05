class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create() {
        this.add.text(400, 250, '¡Juego Terminado!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(400, 350, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default EndScene