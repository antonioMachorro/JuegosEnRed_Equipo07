class TitleMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleMenu' });
    }

    preload(){
        this.load.image('sesion', './Interfaz/iniciarsesion.png');
        this.load.image('button', './Interfaz/jugarGame.png');
    }

    create(){

        this.add.image(960,540,'sesion');
        
                // Camara
                const camera = this.cameras.main;
                camera.setBounds(370, 210, 960, 540);
                camera.setZoom(2.6);
         // Botón para volver al menú principal
         
         this.add.image(960, 680, 'button')  // Añadir la imagen en las coordenadas (960, 660)
         .setScale(0.7)  // Escalar la imagen al 40% de su tamaño original
         .setInteractive()  // Hacerla interactiva (detecta clics o toques)
         .on('pointerdown', () => {  // Cuando se haga clic en la imagen...
             this.scene.start('LoginScene');  // Cambiar a la escena 'MainMenuScene'
         });
}
}
    export default TitleMenu;