class ConnectionError extends Phaser.Scene {
    constructor() {
        super({ key: "ConnectionError" });
    }
/*
    init(data) {
        this.originScene = data.originScene; // Escena original desde donde se llamó a OptionsScene
        this.events.on("shutdown", this.shutdown, this); // Llama a shutdown al cerrar la escena
    }

    */
    preload(){
        this.load.image('marco', './Interfaz/marcoPause.png');
        this.load.image("volver", "./Interfaz/volver.png");
    }


    create() {
        const { width, height } = this.scale;

        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0xff176c, 0.3);
        this.overlay.fillRect(0, 0, width, height);

        this.interfaceFondoPause = this.add.image(960,500,'marco').setScale(3);

       // Titulo
        const errorTitulo = this.add.text(width / 2, 300, 'ERROR DE CONEXIÓN', {
            fontFamily: 'retro-computer',
            fontSize: '92px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Texto
        const errorText = this.add.text(width / 2, 500, 'Se ha perdido la conexión con el servidor', {
            fontFamily: 'retro-computer',
            fontSize: '36px',
            fill: '#fff',
        }).setOrigin(0.5);


        // Boton reintentar
        const continueButton = this.add.text(width / 2, 600, 'Reintentar', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();
        
        continueButton.on('pointerdown', () => {
            this.scene.stop(); // Detener la escena de error
            this.scene.switch(data.originScene); // Cambia directamente a la escena original
        });


    }

}

export default ConnectionError;
