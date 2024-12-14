class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
    }

    preload() {
        // Cargar las imágenes y música
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {
       // Camara
       const camera = this.cameras.main;
       camera.setBounds(370, 210, 960, 540);
       camera.setZoom(2.6);

       this.interfaceFondo = this.add.image(960,540,'fondo').setDepth(-1);

       const returnButton = this.add.image(960,720, 'volver')
       .setScale(0.8)
       .setOrigin(0.5)
       .setInteractive();
       returnButton.on('pointerdown', () => {
           this.scene.start('GameModeScene');
       });

    }
}

export default LobbyScene;
