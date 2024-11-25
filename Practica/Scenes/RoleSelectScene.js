class RoleSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoleSelectScene' });
    }

    preload() {
        this.load.image('policia', './Personajes/police.png');
        this.load.image('ladron', './Personajes/ladron.png');
        this.load.image('wasd', './Interfaz/wasd.png');
        this.load.image('arrows', './Interfaz/arrowKeys.png');
        this.load.image('dice', './Interfaz/dice.png');
        this.load.image('button', './Interfaz/boton.png');
    }

    create() {
        const { width, height } = this.scale;
        this.policeIsOnTheLeft = true;

        const personajesText = this.add.text(width/2, 200, 'PERSONAJES', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        const jugador1Text = this.add.text(200, personajesText.y + 100, 'Player 1', { fontSize: '32px', fill: '#ff0000'}).setOrigin(0.5);
        const jugador2Text = this.add.text(width - 200, personajesText.y + 100, 'Player 2', { fontSize: '32px', fill: '#0000ff'}).setOrigin(0.5);

        this.add.image(jugador1Text.x, jugador1Text.y + 200, 'wasd').setOrigin(0.5);
        
        this.add.image(jugador2Text.x, jugador2Text.y + 200, 'arrows').setOrigin(0.5);

        const policeButton = this.add.image(personajesText.x - 300, personajesText.y + 300, 'policia')
            .setScale(3)
            .setInteractive();
        const thiefButton = this.add.image(personajesText.x + 300, personajesText.y + 300, 'ladron')
            .setScale(3)
            .setInteractive();

        const diceButton = this.add.image(width/2, height/2, 'dice')
            .setScale(0.2)
            .setInteractive();
        diceButton.on('pointerdown', () => {
            diceButton.disableInteractive();
            policeButton.disableInteractive();
            thiefButton.disableInteractive();

            const scene = this;

            const randomSwitch = Phaser.Math.Between(3, 6);
            console.log(randomSwitch);
            let count = 0;

            function animate() {
                scene.tweens.add({
                    targets: [policeButton, thiefButton],
                    x: function(target) {
                        if(target === policeButton) return thiefButton.x;
                        if(target === thiefButton) return policeButton.x;
                    },
                    ease: 'Power1',
                    duration: 100,
                    onComplete: () => {
                        count++;
                        if(count < randomSwitch) {
                            scene.policeIsOnTheLeft = !scene.policeIsOnTheLeft;
                            animate();
                        }
                        else {
                            scene.policeIsOnTheLeft = !scene.policeIsOnTheLeft;
                            diceButton.setInteractive();
                            policeButton.setInteractive();
                            thiefButton.setInteractive();
                        }
                    }
                })
            }

            animate();
        });

        policeButton.on('pointerdown', ()=>{
            this.changePlayerButton(policeButton, thiefButton);
        });

        thiefButton.on('pointerdown', ()=>{
            this.changePlayerButton(policeButton, thiefButton);
        })
        

        this.add.text(policeButton.x, policeButton.y + (policeButton.displayHeight / 2) + 50, 'POLICIA', {fontSize: '32px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(thiefButton.x, thiefButton.y + (thiefButton.displayHeight / 2) + 50, 'LADRON', {fontSize: '32px', fill: '#fff'}).setOrigin(0.5);


        const returnButton = this.add.text(150, height - 100, 'REGRESAR', { fontSize: '32px', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive();
        returnButton.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });

        this.add.image(width - 150, height - 100, 'button')

            .setScale(0.2)
            .setInteractive()
            .on('pointerdown', () => {
                if(this.policeIsOnTheLeft){
                    this.scene.start('GameScene', {player1IsPolice: true});
                } else {
                    this.scene.start('GameScene', {player1IsPolice: false});
                }
            });
    }

    changePlayerButton(button1, button2) {
        button1.disableInteractive();
        button2.disableInteractive();

        this.tweens.add({
            targets: [button1, button2],
            x: function(target) {
                if(target === button1) return button2.x;
                if(target === button2) return button1.x;
            },
            ease: 'Power1',
            duration: 500,
            onComplete: () => {
                this.policeIsOnTheLeft = !this.policeIsOnTheLeft;
                button1.setInteractive();
                button2.setInteractive();
            }
        });
    }
}
export default RoleSelectScene