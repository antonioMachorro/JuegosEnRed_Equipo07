class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    create() {


        this.input.on('pointerdown', () => {
            this.game.connectionManager.sendUpdate();
            if(this.game.connectionManager.getUsername()) {
                this.game.connectionManager.startPolling();
            }
        });

        this.input.keyboard.on('keydown', () => {
            this.game.connectionManager.sendUpdate();
            if(this.game.connectionManager.getUsername()) {
                this.game.connectionManager.startPolling();
            }
        });
    }
}
export default BaseScene;