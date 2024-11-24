class RoleSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoleSelectScene' });
    }

    preload() {
        this.load.image('policia', './Personajes/police.png');
        this.load.image('ladron', './Personajes/ladron.png');
        this.load.image('wasd', './Interfaz/wasd.png');
        this.load.image('controller', './Interfaz/controller.png');
        this.load.image('dice', './Interfaz/dice.png');
        this.load.image('button', './Interfaz/boton.png');
    }

    create() {
        const { width, height } = this.scale;

        const personajesText = this.add.text(width/2, 200, 'PERSONAJES', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        const jugador1Text = this.add.text(200, personajesText.y + 100, 'Player 1', { fontSize: '32px', fill: '#ff0000'}).setOrigin(0.5);
        const jugador2Text = this.add.text(width - 200, personajesText.y + 100, 'Player 2', { fontSize: '32px', fill: '#0000ff'}).setOrigin(0.5);

        const wasdPosition = jugador1Text.x;

        const wasdButton = this.add.image(jugador1Text.x, jugador1Text.y + 200, 'wasd')
            .setScale(0.2)
            .setInteractive();
        
        const controllerButton = this.add.image(jugador2Text.x, jugador2Text.y + 200, 'controller')
            .setScale(0.2)
            .setInteractive();

        const diceButton = this.add.image(width/2, height/2, 'dice')
            .setScale(0.2)
            .setInteractive();

        diceButton.on('pointerdown', ()=>{
            diceButton.disableInteractive();
            wasdButton.disableInteractive();
            controllerButton.disableInteractive();

            const scene = this;

            const randomSwitch = Phaser.Math.Between(3, 6);
            let count = 0;

            function animate() {
                scene.tweens.add({
                    targets: [jugador1Text, jugador2Text, wasdButton, controllerButton],
                    x: function(target) {
                        if(target === jugador1Text) return jugador2Text.x;
                        if(target === jugador2Text) return jugador1Text.x;
                        if(target === wasdButton) return controllerButton.x;
                        if(target === controllerButton) return wasdButton.x;
                    },
                    ease: 'Power1',
                    duration: 100,
                    onComplete: () => {
                        count++;
                        if(count < randomSwitch) animate();
                        else {
                            diceButton.setInteractive();
                            wasdButton.setInteractive();
                            controllerButton.setInteractive();
                        }
                    }
                })
            }

            animate();
        });
        
        wasdButton.on('pointerdown', ()=>{
            this.changePlayerButton(jugador1Text, jugador2Text, wasdButton, controllerButton);
        });

        controllerButton.on('pointerdown', ()=>{
            this.changePlayerButton(jugador1Text, jugador2Text, wasdButton, controllerButton);
        })
        

        const policeImage = this.add.image(personajesText.x - 300, personajesText.y + 300, 'policia').setScale(3);
        const thiefImage = this.add.image(personajesText.x + 300, personajesText.y + 300, 'ladron').setScale(3);

        this.add.text(policeImage.x, policeImage.y + (policeImage.displayHeight / 2) + 50, 'POLICIA', {fontSize: '32px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(thiefImage.x, thiefImage.y + (thiefImage.displayHeight / 2) + 50, 'LADRON', {fontSize: '32px', fill: '#fff'}).setOrigin(0.5);


        const returnButton = this.add.text(150, height - 100, 'REGRESAR', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();

        returnButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        this.add.image(width - 150, height - 100, 'button')

            .setScale(0.2)
            .setInteractive()
            .on('pointerdown', () => {
                if(jugador1Text.x === wasdPosition){
                    this.scene.start('GameScene', {player1IsPolice: true});
                } else {
                    this.scene.start('GameScene', {player1IsPolice: false});
                }
            });
    }

    changePlayerButton(text1, text2, button1, button2) {
        button1.disableInteractive();
        button2.disableInteractive();

        this.tweens.add({
            targets: [text1, text2, button1, button2],
            x: function(target) {
                if(target === text1) return text2.x;
                if(target === text2) return text1.x;
                if(target === button1) return button2.x;
                if(target === button2) return button1.x;
            },
            ease: 'Power1',
            duration: 1000,
            onComplete: () => {
                button1.setInteractive();
                button2.setInteractive();
            }
        });
    }
}
export default RoleSelectScene