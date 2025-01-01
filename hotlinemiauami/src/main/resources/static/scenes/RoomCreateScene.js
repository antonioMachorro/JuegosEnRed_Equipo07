class RoomCreateScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomCreateScene' });
    }

    preload() {

    }

    create() {
        const {width, height} = this.scale;

        const userData = this.registry.get('userData');
        if(!userData || !userData.username) {
            console.warn("No hay usuario guardado en el registro!");
        }

        this.add.text(width/2, height/2 - 100, 'Ingresa el nombre del lobby...', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5);

        this.roomNameInput = document.createElement('input');
        this.roomNameInput.type = 'text';
        this.roomNameInput.placeholder = 'Nombre';
        this.roomNameInput.style.position = 'absolute';
        this.roomNameInput.style.top = `${window.innerHeight / 2 - 40}px`;
        this.roomNameInput.style.left = `${window.innerWidth / 2 - 100}px`;
        this.roomNameInput.style.width = '200px';
        this.roomNameInput.style.fontSize = '20px';
        this.roomNameInput.style.padding = '8px';
        document.body.appendChild(this.roomNameInput);

        this.createButton = this.add.text(width/2, height/2 + 50, 'CREAR', {
            fontFamily: 'retro-computer',
            fontSize: '82px',
            fill: '#fff',
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            const roomName = this.roomNameInput.value.trim();
            if(!roomName) {
                console.warn('El nombre del lobby no puede ser vacio!');
                return;
            }

            fetch('/rooms/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    roomName: roomName,
                    creatorUsername: userData?.username || 'null'
                })
            }).then(response => {
                if(!response.ok) {
                    throw new Error(`Error HTTP:  ${response.status}`);
                }
                return response.json();
            })
            .then(createdRoom => {
                console.log('Room created successfully: ', createdRoom);
                this.scene.start('LobbyScene', {
                    roomData: createdRoom,
                    userData: userData
                });
            }).catch(error => {
                console.error('Error creating room: ', error);
            });
        });

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            document.body.removeChild(this.roomNameInput);
        });
    }
}

export default RoomCreateScene;
