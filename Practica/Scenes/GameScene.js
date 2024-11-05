// File: Scenes/GameScene.js
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('policia', '/Personajes/police.png');
        this.load.image('ladron', '/Personajes/ladron.png');
        this.load.image('red', '/Objetos/red.png');
        this.load.image('background', 'path/to/background.png');
    }

    create() {
        //this.add.image(400, 300, 'background');
        this.playerPolicia = this.physics.add.sprite(100, 300, 'policia');
        this.playerLadron = this.physics.add.sprite(700, 300, 'ladron');
        this.objectRed = this.physics.add.sprite(400, 300, 'red');
        
        this.LadronMovement = true;  // Controla si el ladrón puede moverse

        this.physics.add.collider(this.playerPolicia, this.playerLadron, () => {
            this.scene.start('EndScene');
        });

        this.physics.add.collider(this.playerPolicia, this.objectRed, () => {
            this.LadronMovement = false;

            this.objectRed.destroy();

            this.time.delayedCall(2000, () => {
                this.LadronMovement = true;  // Reactiva los controles del ladrón
            }, [], this);
            
        });

        // Controles del jugador y físicas
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({ up: 'W', left: 'A', down: 'S', right: 'D' });
    }

    update() {
        this.playerPolicia.setVelocity(0, 0);
        this.playerLadron.setVelocity(0, 0);

        // Lógica de movimiento del policía
        if (this.cursors.left.isDown) {
            this.playerPolicia.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.playerPolicia.setVelocityX(200);
        } 
         
        if(this.cursors.up.isDown){
            this.playerPolicia.setVelocityY(-200);
        } else if(this.cursors.down.isDown){
            this.playerPolicia.setVelocityY(200);
        } 

        // Lógica de movimiento del policía
        if (this.LadronMovement){
            if (this.wasd.left.isDown) {
                this.playerLadron.setVelocityX(-240);
            } else if (this.wasd.right.isDown) {
                this.playerLadron.setVelocityX(240);
            } 

            if (this.wasd.up.isDown) {
                this.playerLadron.setVelocityY(-240);
            } else if (this.wasd.down.isDown) {
                this.playerLadron.setVelocityY(240);
            } 
        } else{
            this.playerLadron.setVelocityX(0);
            this.playerLadron.setVelocityY(0);
        }
        
    }
}

export default GameScene;
