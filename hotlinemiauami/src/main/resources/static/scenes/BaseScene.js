class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    create() {


        this.input.on('pointerdown', () => {
            this.game.connectionManager.sendUpdate();
            if(this.game.connectionManager.getUsername()) {
                //this.game.connectionManager.startPolling();
            }
        });

        this.input.keyboard.on('keydown', () => {
            this.game.connectionManager.sendUpdate();
            if(this.game.connectionManager.getUsername()) {
                //this.game.connectionManager.startPolling();
            }
        });

        this.onlineIcon = this.add.image(0, 0, 'online')
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(9999);
        this.positionIcon();

        this.game.events.on('server-status-updated', this.onServerStatusUpdated, this);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off('server-status-updated', this.onServerStatusUpdated, this);
        });
    }

    positionIcon() {
        const { width, height } = this.scale;
        this.onlineIcon.setPosition(1300, 340);
    }

    onServerStatusUpdated(status) {
        this.onlineIcon.setTexture(status ? 'online' : 'offline');
    }
}
export default BaseScene;