import GameScene from "./GameScene.js";

class OnlineGameScene extends GameScene {
    constructor() {
        super({ key: 'OnlineGameScene' });
        this.isOnline = true;

        this.remotePoliceTargetX = 0;
        this.remotePoliceTargetY = 0;
        this.remoteThiefTargetX = 0;
        this.remoteThiefTargetY = 0;
    }

    create(data) {
        super.create(data);

        // Overlay Cargando
        this.loadingOverlay = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.5 } });
        this.loadingOverlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.loadingOverlay.setDepth(10);
        this.loadingOverlay.setVisible(true);

        // Mensaje Cargando
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 170, 'Cargando...', { fontFamily: 'retro-computer', fontfontSize: '32px', fill: '#ffffff' })
        .setOrigin(0.5)
        .setDepth(11)
        .setVisible(true);

        this.pause = true;
        this.socket = data.socket;
        this.roomData = data.roomData;
        console.log("Using socket: ", this.socket);

        this.localIsPolice = this.registry.get('localIsPolice');
        this.isPlayer1 = this.registry.get('isPlayer1');
        
        if(this.localIsPolice) {
            this.playerPolicia.body.setAllowGravity(true);
            this.playerLadron.body.setAllowGravity(false);
        } else {
            this.playerLadron.body.setAllowGravity(true);
            this.playerPolicia.body.setAllowGravity(false);
        }

        console.log(this.localIsPolice ? "Local is police" : "Local is thief");
        console.log(this.registry.get('player1IsPolice') ? "Player1 is police" : "Player1 is thief");

        this.socket.send(JSON.stringify({ type: 'SCENE_READY' }));

        this.socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            this.pause = false;
            this.loadingOverlay.setVisible(false);
            this.loadingText.setVisible(false);

            if (msg.type === 'ROUND_RESET') {
                console.log("ROUND RESET RECEIVED");
        
                this.playerPolicia.setPosition(1215, 705);
                this.playerLadron.setPosition(740, 580);
        
                this.pauseUpdates = false;
            }

            if(msg.type === 'DISCONNECTED') {
                alert(msg.message);
                this.scene.start('LobbyScene', {
                    roomData: this.roomData,
                    userData: this.registry.get('userData'),
                });
            }

            if(!this.pauseUpdates) {
                if(msg.type === 'OTHER_PLAYER_UPDATE') {
                    this.handleOtherPlayerUpdate(msg);
                }
                if(msg.type === 'SPAWN_ITEM') {
                    console.log("RECIEVED SPAWN ITEM MESSAGE");
                    this.spawnItem(msg.x, msg.y);
                }
                if (msg.type === 'SCENE_READY') {
                    console.log("OTHER SCENE IS READY!");
                    if (this.roomData.creatorUsername === data.userData.username) {
                        this.spawnRandomModifierOnline();

                    }
                }
                if(msg.type === 'COLLECT_ITEM') {
                    this.setModifier(msg.item);
                }
                if(msg.type === 'ITEM_USED') {
                    this.useModifier();
                    setTimeout(() => {
                        this.spawnRandomModifierOnline();
                    }, 3000);
                }
                if(msg.type === 'TRAMPILLA_USED') {
                    switch(msg.trampillaId) {
                        case 1:
                            this.startTrampillaCooldown();
                            break;
                        case 2:
                            this.startTrampillaCooldown1();
                            break;
                        case 3:
                            this.startTrampillaCooldown2();
                            break;
                        default:
                            console.log("No trampilla for this ID.");
                            break;
                    }
                }
                if(msg.type === 'DOOR_USED') {
                    console.log(`Door: ${msg.door} will ${msg.action}!`);
                    this.handleDoorAction(msg.door, msg.action);
                }
            }
        }
    }

    update(time, delta) {

        if(!this.pause) {
            if(this.localIsPolice)
            {
                this.updatePoliceMovement(time, delta);

                this.sendLocalPlayerData(true);
            } else {
                this.updateThiefMovement(time, delta);

                this.sendLocalPlayerData(false);
            }
        }
    }

    sendLocalPlayerData(isPolice) {
        if(!this.socket || this.socket.readyState !== WebSocket.OPEN) return;

        let msg;
        let currentAnim;
        if(isPolice) {

            currentAnim = this.playerPolicia.anims.currentAnim ? this.playerPolicia.anims.currentAnim.key : 'police_idle';

            msg = {
                type: "LOCAL_PLAYER_UPDATE",
                isPolice: true,
                x: this.playerPolicia.x,
                y: this.playerPolicia.y,
                facingRight: this.policiaFacingRight,
                animKey: currentAnim,
                blockedLeft: this.playerPolicia.body.blocked.left,
                blockedRight: this.playerPolicia.body.blocked.right,
            };
        } else {

            currentAnim = this.playerLadron.anims.currentAnim ? this.playerLadron.anims.currentAnim.key : 'thief_idle';

            msg = {
                type: "LOCAL_PLAYER_UPDATE",
                isPolice: false,
                x: this.playerLadron.x,
                y: this.playerLadron.y,
                facingRight: this.ladronFacingRight,
                animKey: currentAnim,
                blockedLeft: this.playerLadron.body.blocked.left,
                blockedRight: this.playerLadron.body.blocked.right,
            };
        }

        this.socket.send(JSON.stringify(msg));
    }

    handleOtherPlayerUpdate(msg) {

        if(this.pauseUpdates) return;

        if(msg.isPolice) {
           this.playerPolicia.x = msg.x;
           this.playerPolicia.y = msg.y;
           this.playerPolicia.facingRight = msg.facingRight;
           if (msg.blockedLeft || msg.blockedRight) {
                if(msg.blockedLeft) {
                    this.playerPolicia.flipX = false;
                } else if(msg.blockedRight) {
                    this.playerPolicia.flipX = true;
                }
                this.playerPolicia.anims.play("police_wall", true);
            } else {
                this.playerPolicia.flipX = !msg.facingRight;
                if(msg.animKey) {
                    this.playerPolicia.anims.play(msg.animKey, true);
                }
            }
        } else {
            this.playerLadron.x = msg.x;
            this.playerLadron.y = msg.y;
            this.playerLadron.facingRight = msg.facingRight;
            if (msg.blockedLeft || msg.blockedRight) {
                if(msg.blockedLeft) {
                    this.playerLadron.flipX = false;
                } else if(msg.blockedRight) {
                    this.playerLadron.flipX = true;
                }
                this.playerLadron.anims.play("thief_wall", true);
            } else {
                this.playerLadron.flipX = !msg.facingRight;
                if(msg.animKey) {
                    this.playerLadron.anims.play(msg.animKey, true);
                }
            }
        }
    }

    spawnRandomModifierOnline() {
        if (this.policiaInventory == null) {
            const randomPos =
            this.positionPool[Math.floor(Math.random() * this.positionPool.length)];

            this.spawnItem(randomPos.x, randomPos.y);

            let msg = {
                type: "SPAWN_ITEM",
                x: randomPos.x,
                y: randomPos.y
            };
            this.socket.send(JSON.stringify(msg));
        }
    }

    spawnItem(x, y) {

    console.log(`SPAWNING ITEM IN (${x}, ${y})`);

    if (this.currentModifier) {
        this.currentModifier.destroy();
    }

    this.currentModifier = this.physics.add.sprite(x, y, 'bonificaciones');
        this.currentModifier.anims.play('item');
        this.currentModifier.body.setAllowGravity(false);

        // Añadir colisión con el policía para recoger el modificador
        this.physics.add.overlap(
        this.playerPolicia,
        this.currentModifier,
        this.collectModifier,
        null,
        this
        );
    }
}

export default OnlineGameScene;