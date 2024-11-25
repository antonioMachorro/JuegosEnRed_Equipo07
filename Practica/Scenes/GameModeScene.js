class GameModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameModeScene' });
    }

    create() {
        const { width, height } = this.scale;

        this.add.text(width/2, 250, 'MODO DE JUEGO', { 
            fontFamily: 'retro-computer', 
            fontSize: '64px', 
            fill: '#fff' }).setOrigin(0.5);

        const localButton = this.add.text(width/2, 450, 'LOCAL', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();
        localButton.on('pointerdown', () => {
            this.scene.start('RoleSelectScene');
        });

        const redButton = this.add.text(width/2, 650, 'RED', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#858585' }).setOrigin(0.5);
        
        /*
        redButton.on('pointerdown', () => {
            this.scene.start('RoleSelectScene');
        });
        */

        const returnButton = this.add.text(150, height - 100, 'REGRESAR', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' })
        .setOrigin(0.5)
        .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default GameModeScene