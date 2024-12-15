class GameModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameModeScene' });
    }

    preload(){
        this.load.image('mododejuego', './Interfaz/mododejuego.png');
        this.load.image('local', './Interfaz/local.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('red', './Interfaz/red.png')

    }

    create() {
        const { width, height } = this.scale;

        this.add.image(960,540,'mododejuego');

        this.add.text(width/2, 250, 'MODO DE JUEGO', { 
            fontFamily: 'retro-computer', 
            fontSize: '64px', 
            fill: '#fff' }).setOrigin(0.5);

        const localButton = this.add.image(861,574, 'local', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();
        localButton.on('pointerdown', () => {
            this.scene.start('RoleSelectScene');
        });

        const redButton = this.add.image(1059,573, 'red', { 
            fontFamily: 'retro-computer',
            fontSize: '32px', 
            fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();
        redButton.on('pointerdown', () => {
            this.scene.start('LobbyScene');
        });
        

         // Ajustar la cámara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        const returnButton = this.add.image(960,720, 'volver')
        .setScale(0.8)
        .setOrigin(0.5)
        .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}
export default GameModeScene