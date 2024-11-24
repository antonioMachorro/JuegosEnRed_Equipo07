class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data){
        this.winner = data.winner;
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width/2, 250, `¡Ha ganado el ${this.winner}!`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

        const restartButton = this.add.text(width/2, 350, 'Volver al menú', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default VictoryScene