class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload(){
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.image('iniciar','./Interfaz/iniciarboton.png' );
        this.load.image('sesion', './Interfaz/iniciarsesion.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('noacc', './Interfaz/notengocuenta.png');
    }

    create() {

        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        this.add.image(960, 540, 'menuPrincipal');
        this.add.image(960, 540, 'sesion');
        this.add.image(960, 580, 'iniciar')  // Añadir la imagen en las coordenadas (960, 580)
         .setInteractive()  // Hacerla interactiva (detecta clics o toques)
         .on('pointerdown', () => {  // Cuando se haga clic en la imagen...
             this.scene.start('MainMenuScene');  // Cambiar a la escena 'MainMenuScene'
         });

         this.add.image(960, 618, 'noacc')  // Añadir la imagen en las coordenadas (960, 660)
         .setScale(1)
         .setInteractive()  // Hacerla interactiva (detecta clics o toques)
         .on('pointerdown', () => {  // Cuando se haga clic en la imagen...
             this.scene.start('CreateAccScene');  // Cambiar a la escena 'MainMenuScene'
         });

    }
}

export default LoginScene;
