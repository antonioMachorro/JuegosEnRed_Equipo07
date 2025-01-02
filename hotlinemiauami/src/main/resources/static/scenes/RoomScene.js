class RoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomScene' });
    }

    preload() {
        this.load.image('menuPrincipal', './Interfaz/fondo2.png');
        this.load.image('crearSala', './Interfaz/crearSala.png');
        this.load.image('encontrarSala', './Interfaz/encontrarSala.png');
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {

        const { width, height } = this.scale;

        const camera = this.cameras.main;
                camera.setBounds(370, 210, 960, 540);
                camera.setZoom(2.6);

        this.Interfaz = this.add.image(970, 520, 'menuPrincipal').setScale(1.4);
        this.Interfaz = this.add.image(960, 540, 'marcoPause');

        this.add.text(width/2, 480, 'JUEGO EN RED', { 
            fontFamily: 'retro-computer', 
            fontSize: '42px', 
            fill: '#fff' }).setOrigin(0.5);


        const createRoomButton = this.add.image(850, 570, 'crearSala', {
        }).setOrigin(0.5)
        .setScale(0.7)
        .setInteractive();

        createRoomButton.on('pointerdown', () => {
            this.scene.start('RoomCreateScene');
        })

        const joinRoomButton = this.add.image(1050, 570, 'encontrarSala', {
        }).setOrigin(0.5)
        .setScale(0.7)
        .setInteractive();

        joinRoomButton.on('pointerdown', () => {
            this.scene.start('RoomSelectScene');
        })

        // Botón para volver
        const returnButton = this.add.image(960,720, 'volver')
        .setScale(0.8)
        .setOrigin(0.5)
        .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });
    }
}

export default RoomScene;
