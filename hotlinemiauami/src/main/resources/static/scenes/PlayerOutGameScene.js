class PlayerOutGameScene extends Phaser.Scene {
    constructor() {
        super({ key: "PlayerOutGameScene" });
    }

    init(data) {
        this.originScene = data.originScene; // Escena original desde donde se llamó 
    }

    preload(){
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
    }


    create() {
        const { width, height } = this.scale;

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xff176c, 0.3);
        this.overlay.fillRect(0, 0, width, height);

        this.interfaceFondoPause = this.add.image(960,500,'marcoPause').setScale(3);

       // Titulo
        const errorTitulo = this.add.text(width / 2, 450, 'EL OTRO JUGADOR ABANDONÓ LA PARTIDA', {
            fontFamily: 'retro-computer',
            fontSize: '40px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Boton reintentar
        const continueButton = this.add.text(width / 2, 700, 'Volver al menu principal', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();
        
        continueButton.on('pointerdown', () => {
            this.scene.stop(); // Detener la escena 
            this.scene.start('MainMenuScene'); // Cambia al menu principal
        });
    }
}

export default PlayerOutGameScene;
