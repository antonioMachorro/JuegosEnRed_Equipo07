class ControlesScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ControlesScene' });
    }

    preload(){
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.image('mando','./Interfaz/mando.png')
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {
        const { width, height } = this.scale;

        this.add.image(960, 540, 'menuPrincipal').setScale(2.6);
        this.add.image(960,540,'marcoPause').setScale(3.5);
        // Título de Créditos
        this.add.text(width / 2, 250, 'Controles', { 
            fontFamily: 'retro-computer', 
            fontSize: '32px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        // Nombres de los integrantes
        const names = [
            'Jugador 1 y juego multijugador:',
            'W: Saltar',
            'A: Izquierda',
            'D: Derecha',
            'ESPACIO: Acción especial',
        ];

        const names2 = [
            'Jugador 2:',
            'FLECHA ARRIBA: Saltar',
            'FLECHA IZQUIERDA: Izquierda',
            'FLECHA DERECHA: Derecha',
            'SHIFT DERECHO Acción especial',
        ];

        names.forEach((name, index) => {
            this.add.text(width / 2 - 650, 400 + (index * 50), name, { 
                fontFamily: 'retro-computer', 
                fontSize: '28px', 
                fill: '#fff' 
            }).setOrigin(0, 0.5);
        });

        names2.forEach((name, index) => {
            this.add.text(width / 2 + 75, 400 + (index * 50), name, { 
                fontFamily: 'retro-computer', 
                fontSize: '28px', 
                fill: '#fff' 
            }).setOrigin(0, 0.5);
        });

        // Botón para regresar al menú principal
        const backButton = this.add.image(width/2,850 , 'volver', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' 
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('TutorialScene');
        });
    }
}

export default ControlesScene;
