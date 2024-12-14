class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload(){
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {

    }
}

export default LoginScene;
