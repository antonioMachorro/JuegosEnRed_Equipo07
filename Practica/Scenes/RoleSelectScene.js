class RoleSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoleSelectScene' });
    }

    preload() {
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('police', './Personajes/police.png');
        this.load.image('thief', './Personajes/ladron.png');
        this.load.image('wasd', './Interfaz/wasd.png');
        this.load.image('arrows', './Interfaz/arrowKeys.png');
        this.load.image('dice', './Interfaz/dice.png');
        this.load.image('button', './Interfaz/jugarGame.png');
        this.load.image('volver', './Interfaz/volver.png');

    }

    create() {
        this.policeIsOnTheLeft = true;
        
        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        this.interfaceFondo = this.add.image(960,540,'fondo').setDepth(-1);

        // Controles de movimiento
        this.add.image(750, 630, 'wasd').setOrigin(0.5).setScale(0.3);
        this.add.image(1150,630, 'arrows').setOrigin(0.5).setScale(0.3);

        // Botones de personajes
        const policeButton = this.add.image(750,540, 'police')
            .setScale(3)
            .setInteractive();

        const thiefButton = this.add.image(1150, 540, 'thief')
            .setScale(3)
            .setInteractive();

        // Textos de personajes
        const policeText = this.add.text(750, 450, 'Policia', {
            fontFamily: 'retro-computer',
            fontSize: '18px', 
            fill: '#fff' 
        }).setOrigin(0.5);

        const thiefText = this.add.text(1150,450, 'Ladron', {
            fontFamily: 'retro-computer',
            fontSize: '18px', 
            fill: '#fff' 
        }).setOrigin(0.5);


        

        // Botón de dado
        const diceButton = this.add.image(960, 540, 'dice')
            .setScale(0.2)
            .setInteractive();

        diceButton.on('pointerdown', () => {
            diceButton.disableInteractive();
            policeButton.disableInteractive();
            thiefButton.disableInteractive();

            const scene = this;
            const randomSwitch = Phaser.Math.Between(3, 6);
            let count = 0;

            function animate() {
                scene.tweens.add({
                    targets: [policeButton, thiefButton, policeText, thiefText],
                    x: function(target) {
                        if (target === policeButton) return thiefButton.x;
                        if (target === thiefButton) return policeButton.x;
                        if (target === policeText) return thiefText.x;
                        if (target === thiefText) return policeText.x;
                    },
                    ease: 'Power1',
                    duration: 100,
                    onComplete: () => {
                        count++;
                        if (count < randomSwitch) {
                            scene.policeIsOnTheLeft = !scene.policeIsOnTheLeft;
                            animate();
                        } else {
                            scene.policeIsOnTheLeft = !scene.policeIsOnTheLeft;
                            diceButton.setInteractive();
                            policeButton.setInteractive();
                            thiefButton.setInteractive();
                        }
                    }
                });
            }

            animate();
        });

        
        // Botón de regresar
        const returnButton = this.add.image(960,720, 'volver').setOrigin(0.5).setScale(0.8).setInteractive();

        returnButton.on('pointerdown', () => {
            this.scene.start('GameModeScene');
        });

        // Botón de jugar
        this.add.image(960, 660, 'button')
            .setScale(0.4)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.policeIsOnTheLeft) {
                    this.scene.start('GameScene', { player1IsPolice: true });
                } else {
                    this.scene.start('GameScene', { player1IsPolice: false });
                }
            });

            
    }

    changePlayerButton(button1, button2, text1, text2) {
        button1.disableInteractive();
        button2.disableInteractive();

        this.tweens.add({
            targets: [button1, button2, text1, text2],
            x: function(target) {
                if (target === button1) return button2.x;
                if (target === button2) return button1.x;
                if (target === text1) return text2.x;
                if (target === text2) return text1.x;
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

export default RoleSelectScene;
