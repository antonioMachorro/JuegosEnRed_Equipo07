class RoomScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomScene' });
    }

    preload() {

    }

    create() {

        const { width, height } = this.scale;

        const createRoomButton = this.add.text(width / 2, 300, 'Crear lobby...', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

        createRoomButton.on('pointerdown', () => {
            this.scene.start('RoomCreateScene');
        })

        const joinRoomButton = this.add.text(width / 2, createRoomButton.y + 200, 'Encontrar lobby...', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive();

        joinRoomButton.on('pointerdown', () => {
            this.scene.start('RoomSelectScene');
        })
    }
}

export default RoomScene;
