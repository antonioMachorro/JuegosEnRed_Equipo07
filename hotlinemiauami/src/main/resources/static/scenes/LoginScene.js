class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload(){
        this.load.image('marcoPause', './Interfaz/iniciarsesion.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {
        this.add.image(960, 660, 'volver')  // Añadir la imagen en las coordenadas (960, 660)
         .setScale(0.7)  // Escalar la imagen al 40% de su tamaño original
         .setInteractive()  // Hacerla interactiva (detecta clics o toques)
         .on('pointerdown', () => {  // Cuando se haga clic en la imagen...
             this.scene.start('MainMenuScene');  // Cambiar a la escena 'MainMenuScene'
         });
    }
}

export default LoginScene;
