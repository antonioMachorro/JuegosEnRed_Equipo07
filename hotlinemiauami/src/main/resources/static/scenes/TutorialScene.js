class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }

    preload(){
        this.load.image('mando','./Interfaz/mando.png')
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
    }

    create() {
        const { width, height } = this.scale;

        this.add.image(960, 540, 'menuPrincipal').setScale(2.6);
        this.add.image(960,540,'marcoPause').setScale(3.5);
        // Título de Créditos
        this.add.text(width / 2, 250, '¿Cómo se juega?', { 
            fontFamily: 'retro-computer', 
            fontSize: '32px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        // Nombres de los integrantes
        const names = [
            'Objetivo:',
            'Policía: Cazar al ladrón',
            'Ladrón: Escapar del policía hasta agotar el tiempo',
            '',
            'Acciones especiales:',
            'Policía: Utilizar los bonificadores que aparecen por el mapa',
            'Ladrón: Desplazarse por tuberías y cerrar puertas'
        ];

        names.forEach((name, index) => {
            this.add.text(width / 2 - 600, 375 + (index * 50), name, { 
                fontFamily: 'retro-computer', 
                fontSize: '28px', 
                fill: '#fff',
                align:'left' 
                
            }).setOrigin(0,0.5);
        });

        // Botón para regresar al menú principal
        const backButton = this.add.image(width/2,850, 'volver', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' 
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        const mandoButton = this.add.image(1625,245, 'mando', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' 
        })
        .setOrigin(0.5)
        .setScale(1.5)
        .setInteractive();

        mandoButton.on('pointerdown', () => {
            this.scene.start('ControlesScene');
        });

    }
}

export default TutorialScene;
