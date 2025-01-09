class RoomSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomSelectScene' });
        this.scrollY = 0;
        this.roomList = [];
    }

    preload() {
        this.load.image('menuPrincipal', './Interfaz/fondo2.png');
        this.load.image('menuPrincipal', './Interfaz/menuPrincipal.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('marcoPause', './Interfaz/marcoPause.png');
        this.load.image('crearSala', './Interfaz/crearSala.png');
    }

    create() {

        const {width, height} = this.scale;

        this.Interfaz = this.add.image(960, 500, 'menuPrincipal').setScale(3.8);
        this.Interfaz = this.add.image(960, 540, 'marcoPause').setScale(3.2);

        this.add.text(width/2, 280, 'Selecciona una sala', {
            fontFamily: 'retro-computer',
            fontSize: '48px',
            fill: '#fff',
        }).setOrigin(0.5);

        const listContainer = this.add.rectangle(
            width * 0.5,
            height * 0.5,
            width * 0.4,
            height * 0.28,
            0xfff,
            0
        ).setOrigin(0.5);

        this.roomListContainer = this.add.container(listContainer.x - (listContainer.displayWidth/2), 
            listContainer.y - (listContainer.displayHeight/2));

        const maskShape = this.make.graphics({ x: listContainer.x - listContainer.displayWidth / 2, 
            y: listContainer.y - listContainer.displayHeight / 2, add: false});
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(0, 0, listContainer.displayWidth, listContainer.displayHeight);
        const mask = maskShape.createGeometryMask();
        this.roomListContainer.setMask(mask);

        const refreshButton = this.add.text(width/2, 800, 'Actualizar', {
            fontFamily: 'retro-computer',
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.loadRoomData();
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.scrollY -= deltaY * 0.5;

            const viewHeight = listContainer.displayHeight;
            const contentHeight = this.totalHeight || 0;

            if(contentHeight <= viewHeight) {
                this.scrollY = 0;
            } else {
                const minScroll = -(contentHeight - viewHeight);
                const maxScroll = 0;

                this.scrollY = Phaser.Math.Clamp(this.scrollY, minScroll, maxScroll);
            }

            this.roomListContainer.y = (listContainer.y - listContainer.displayHeight / 2) + this.scrollY;
        });

             const returnButton = this.add.image(960,1000, 'volver')
             .setScale(2.0)
             .setOrigin(0.5)
             .setInteractive();
             returnButton.on('pointerdown', () => {
                 this.scene.start('RoomScene');
             });

        this.loadRoomData();
    }

    loadRoomData() {
        console.log("Loading room data...");
        this.clearRoomList();

        fetch('/rooms/available')
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(roomList => {
            console.log('Available rooms: ', roomList);
            this.createRoomList(roomList);
        })
        .catch(error => {
            console.error('Error fetching rooms: ', error);
        })
    }

    createRoomList(roomList) {

        const userData = this.registry.get('userData');
        if(!userData || !userData.username) {
            console.warn("No hay usuario guardado en el registro!");
        }

        let currentY = 0;
        const cardSpacing = 15;
        const cardHeight = 90;

        roomList.forEach(room => {
            const roomContainer = this.add.container(0, currentY);

            const rect = this.add.rectangle(0, 0, this.scale.width * 0.8 - 20, cardHeight, 0x87cefa).setOrigin(0, 0)
            .setInteractive()
            .on('pointerdown', () => {
                fetch(`/rooms/${room.roomId}/join`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ secondUsername: userData?.username })
                }).then(response => response.json())
                .then(updatedRoom => {
                    this.scene.start('LobbyScene', {
                        roomData: updatedRoom,
                        userData: userData
                    });
            }).catch(error => {
                console.error('Error joining room: ', error);
                });
            });

            rect.setStrokeStyle(2, 0xffffff);
            
            const textStyle = { 
                fontFamily: 'retro-computer',
                fontSize: '14px',
                color: '#000'
            }

            const roomId = this.add.text(10, 15, room.roomId, textStyle);

            const roomName = this.add.text(10, 30, room.roomName, textStyle);

            const roomCreator = this.add.text(10, 55, room.creatorUsername, textStyle);

            roomContainer.add([rect, roomId, roomName, roomCreator]);
            this.roomListContainer.add(roomContainer);
            this.roomList.push({ roomContainer, });

            currentY += (cardHeight + cardSpacing);
        });

        this.totalHeight = currentY;
    }

    clearRoomList() {
        this.roomList.forEach(item => {
            item.roomContainer.destroy();
        });
        this.roomList = [];
    }
}

export default RoomSelectScene;
