class CreateAccScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreateAccScene' });
    }

    preload(){
        this.load.image('crearCuenta', './Interfaz/crearcuenta.png');
        this.load.image('crearboton', './Interfaz/crearboton.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
    }

    create() {

        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        this.add.image(960, 540, 'menuPrincipal');
        this.add.image(960, 540, 'crearCuenta');
        this.add.image(962, 600, 'crearboton')  // Añadir la imagen en las coordenadas (960, 660)
         .setInteractive()  // Hacerla interactiva (detecta clics o toques)
         .on('pointerdown', () => {  // Cuando se haga clic en la imagen...
             this.scene.start('LoginScene');  // Cambiar a la escena 'MainMenuScene'
         });
    }
}

export default CreateAccScene;
