class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    preload(){
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {
        const { width, height } = this.scale;

        this.add.image(960,540,'marcoPause').setScale(3.5);
        // Título de Créditos
        this.add.text(width / 2, 300, 'CRÉDITOS', { 
            fontFamily: 'retro-computer', 
            fontSize: '48px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        // Nombres de los integrantes
        const names = [
            'Adrián Espínola Gumiel',
            'Álvaro Rosa Pedraza',
            'Antonio Machorro Herrera',
            'David Antonio Paz Gullón',
            'Laura Manso Herrero'
        ];

        names.forEach((name, index) => {
            this.add.text(width / 2, 400 + (index * 75), name, { 
                fontFamily: 'retro-computer', 
                fontSize: '32px', 
                fill: '#fff' 
            }).setOrigin(0.5);
        });

        // Botón para regresar al menú principal
        const restartButton = this.add.image(350,850, 'volver', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' 
        })
        .setOrigin(0.5)
        .setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

export default CreditsScene;
