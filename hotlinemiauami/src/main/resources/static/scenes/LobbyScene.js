class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
        this.fetchIntervalId = null;
    }

    init(data) {
        if (this.registry.get("localIsPolice") === undefined) {
            this.registry.set("localIsPolice", undefined);
        }
        if (this.registry.get("isPlayer1") === undefined) {
            this.registry.set("isPlayer1", undefined);
        }  
    }

    preload() {
        // Cargar imágenes y sprites
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('volver', './Interfaz/volver.png');
        this.load.image('listo', './Interfaz/listoPartida.png');
        this.load.image('cancelar', './Interfaz/cancelarPartida.png');

        this.load.atlas(
            "policia",
            "./Personajes/Policia_Spritesheet.png",
            "./Personajes/policia_spritesheet.json"
        );

        this.load.atlas(
            "ladron",
            "./Personajes/Ladron_Spritesheet.png",
            "./Personajes/ladron_spritesheet.json"
        );
    }

    create(data) {
        const { width, height } = this.scale;
        const userData = this.registry.get('userData');

        console.log(window.location.hostname);

        const wsUrl = `ws://${window.location.hostname}:8080/ws/room/${data.roomData.roomId}`;
        this.chatSocket = new WebSocket(wsUrl);

        this.chatSocket.onopen = () => {
            console.log("Websocket connected to room Id: ", data.roomData.roomId);

            // Mensaje de usuario se conectó al chat 
            const enteredMessage = {
                type: "CHAT",
                username: userData.username,
                content: "entró al chat.",
                isSystem: true
            };
            this.chatSocket.send(JSON.stringify(enteredMessage));

            setTimeout(() => {
                this.fetchRoomData(this.roomData.roomId);
            }, 200);
        };

        this.chatSocket.onmessage = (event) => {
            const message = event.data;
            console.log("Received message: ", message);

            let messObj;
            try {
                messObj = JSON.parse(message);
            } catch(error) {
                console.warn("Non-JSON message: ", message);
                this.appendChatMessage(message);
                return;
            }

            if(messObj.type === "ROOM_UPDATED") {
                this.roomData.creatorUsername = messObj.creatorUsername;
                this.roomData.secondUsername = messObj.secondUsername;
                this.roomData.creatorReady = messObj.creatorReady;
                this.roomData.secondReady = messObj.secondReady;
                this.updateReadyLabels();

                if(this.roomData.creatorReady && this.roomData.secondReady) {

                    const isLocalPolice = (userData.username === this.roomData.creatorUsername);
                    this.registry.set('player1IsPolice', isLocalPolice);
                    this.registry.set('localIsPolice', isLocalPolice);
                    this.registry.set('isPlayer1', isLocalPolice);

                    this.scene.start('OnlineGameScene', {
                        socket: this.chatSocket,
                        roomData: this.roomData,
                        userData: data.userData,
                    });
                }
            } else if(messObj.type === "CHAT") {
                if(messObj.isSystem){
                    this.appendSystemMessage(`${messObj.username} ${messObj.content}`);
                } else {
                    const chat = `${messObj.username}: ${messObj.content}`;
                    this.appendChatMessage(chat);
                }
            }
        };

        this.chatSocket.onclose = (evt) => {
            console.log("Websocket closed: ", evt);
        }

        console.log(data.roomData);
        this.roomData = data.roomData;

        // Camara
        const camera = this.cameras.main;
        camera.setBounds(370, 210, 960, 540);
        camera.setZoom(2.6);

        // Fondo
        this.interfaceFondo = this.add.image(960, 540, 'fondo');

        // Botón para volver
        const returnButton = this.add.image(960, 720, 'volver')
            .setScale(0.8)
            .setOrigin(0.5)
            .setInteractive();

        returnButton.on('pointerdown', () => {

            const exitMessage = {
                type: "CHAT",
                username: userData.username,
                content: "salió al chat.",
                isSystem: true
            };

            const msg = {
                type: "SET_READY",
                username: data.userData.username,
                isReady: false
            };

            this.chatSocket.send(JSON.stringify(exitMessage));
            this.chatSocket.send(JSON.stringify(msg));
            this.chatSocket.close();

            try {
                const response = fetch(`/rooms/${this.roomData.roomId}/leave`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: userData.username
                    }),
                });

                if (!response.ok) {
                    console.error("Error al salir de la sala: ", response.text());
                }
            } catch (error) {
                console.error("Error al conectar con servidor: ", error);
            } finally {
                this.scene.start('GameModeScene');
            }
        });

        //Limpiar el chat antes de mostrarlo
        this.clearChat();
        // Mostrar el chat
        this.showChat();

        // Animaciones
        this.anims.create({
            key: "police_run",
            frames: this.anims.generateFrameNames("policia", {
                prefix: "run",
                end: 5,
                zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: "thief_run",
            frames: this.anims.generateFrameNames("ladron", {
                prefix: "run",
                end: 7,
                zeroPad: 3,
            }),
            frameRate: 6,
            repeat: -1,
        });

        const policia = this.add.sprite(975, 600, "policia");
        policia.play("police_run");

        const ladron = this.add.sprite(1175, 600, "ladron");
        ladron.play("thief_run");

        this.salaText = this.add.text(width/2 - 30, 415, 'SALA', {
            fontFamily: 'retro-computer',
            fontSize: '24px',
            color: '#ffffff'
        });

        this.salaText = this.add.text(width/2 - 210, 415, 'CHAT', {
            fontFamily: 'retro-computer',
            fontSize: '24px',
            color: '#ffffff'
        });

        this.player1Text = this.add.text(900, 475, 'Jugador 1: ???', {
            fontFamily: 'retro-computer',
            fontSize: '12px',
            color: '#ffffff'
        });

        this.player2Text = this.add.text(900, 525, 'Jugador 2: ???', {
            fontFamily: 'retro-computer',
            fontSize: '12px',
            color: '#ffffff'
        });

        this.updateReadyLabels();

        // Limpiar el chat y ocultarlo cuando se cierra la escena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {

            // Mensaje de usuario se desconectó al chat 
            try {
                const response = fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user: userData.username,
                        message: "salió del chat",
                        isSystemMessage: true,
                    }),
                });

                if (!response.ok) {
                    console.error("Error al enviar el mensaje: ", response.text());
                }
            } catch (error) {
                console.error("Error al conectar con servidor: ", error);
            }

            this.clearChat();
            this.hideChat();
        });

        // Inicializar el chat
        this.initChat(userData.username);
        //this.fetchMessages();

        const roomNameText = this.add.text(1100,400, `SALA: ${data.roomData.roomName}`, {
            fontFamily: 'retro-computer', 
            fontSize: '12px', 
            fill: '#ffffff' 
        }).setOrigin(0.5);

        //Boton para alistarse
        this.readyButton = this.add.image(1075, 600, 'listo', {
            fontFamily: 'retro-computer',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            const msg = {
                type: "SET_READY",
                username: data.userData.username,
                isReady: true
            };
            this.chatSocket.send(JSON.stringify(msg));
        });
    }

    updateReadyLabels() {
        const player2 = this.roomData.secondUsername || "[Esperando...]";

        const player1Status = this.roomData.creatorReady ? "(LISTO)" : "(No listo...)";
        const player2Status = this.roomData.secondReady ? "(LISTO)" : "(No listo...)";

        this.player1Text.setText(`Jugador 1: ${this.roomData.creatorUsername} --- ${player1Status}`);
        this.player2Text.setText(`Jugador 2: ${player2} --- ${player2Status}`);
    }

    showChat() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'block'; // Mostrar el chat
        }
    }

    hideChat() {
        const chatContainer = document.getElementById('chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'none'; // Ocultar el chat
        }
    }

    clearChat() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = ''; // Vaciar los mensajes del chat
        }
    }

    fetchRoomData(roomId) {
        fetch(`/rooms/${roomId}`)
        .then(response => response.json())
        .then(room => {
            if (room) {
                this.roomData.creatorUsername = room.creatorUsername;
                this.roomData.secondUsername = room.secondUsername;
                this.roomData.creatorReady = room.creatorReady;
                this.roomData.secondReady = room.secondReady;
                this.updateReadyLabels();
            }
        })
        .catch(error => {
            console.error("Failed to fetch room data: ", error);
        });
    }

    initChat(username) {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        const newChat = chatInput.cloneNode(true);
        chatInput.parentNode.replaceChild(newChat, chatInput);

        // Envio de mensajes
        newChat.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter' && newChat.value.trim() !== '') {
                console.log("Sending chat...");
                const message = newChat.value.trim();
                newChat.value = ''; // Limpiar el campo de entrada

                const chatMessage = {
                    type: "CHAT",
                    username: username,
                    content: message
                };
                this.chatSocket.send(JSON.stringify(chatMessage));

                // Esperar a que el mensaje se añada antes de hacer scroll
                setTimeout(() => {
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 100); 

            }
        });
    }

    appendChatMessage(msg) {
        const chatMessages = document.getElementById('chat-messages');
        if(chatMessages) {
            const div = document.createElement('div');
            div.textContent = msg;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    appendSystemMessage(msg) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
          const div = document.createElement('div');
          div.textContent = `{${msg}}`;
          div.style.color = '#D478E9'; 
          chatMessages.appendChild(div);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }

    // Función para filtrar palabras malsonantes
    filterProfanity(message) {
        const profaneWords = ['cooked']; // Lista de palabras a filtrar
        let filteredMessage = message;

        profaneWords.forEach(word => {
            const regex = new RegExp(word, 'gi'); // Insensible a mayúsculas y global
            filteredMessage = filteredMessage.replace(regex, '*****'); // Reemplazar con asteriscos
        });

        return filteredMessage;
    }

    async fetchMessages() {
        const chatMessages = document.getElementById('chat-messages');
        let lastMessageId = 0;

        this.clearFetchInterval();

        console.log("Fetching messages...");

        this.fetchIntervalId = setInterval(async () => {
            try {
                const response = await fetch(`api/chat?since=${lastMessageId}`);
                if (response.ok) {
                    const messages = await response.json();
                    let isScrolledToTop = chatMessages.scrollHeight - chatMessages.scrollTop === chatMessages.clientHeight; // Verificar si el usuario esta viendo el mensaje final
                    messages.forEach((message) => {
                        // Filtrar palabras malsonantes
                        const filteredMessage = this.filterProfanity(message.message);

                        const messageElement = document.createElement('div');

                        if (message.isSystemMessage) {
                            messageElement.textContent = `{${message.user} ${filteredMessage}}`;
                            messageElement.style.color = '#D478E9';
                        } else {
                            messageElement.textContent = `${message.user}: ${filteredMessage}`;
                        }

                        chatMessages.appendChild(messageElement);
                        lastMessageId = message.id;
                    });

                    // Hacer scroll al final de los mensajes
                    if (isScrolledToTop) {
                        setTimeout(() => {
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                        }, 100); 
                    }

                }
            } catch (error) {
                console.error('Error al obtener mensajes:', error);
            }
        }, 1000);
    }

    clearFetchInterval() {
        if (this.fetchIntervalId) {
            clearInterval(this.fetchIntervalId);
            this.fetchIntervalId = null;
        }
    }

    async fetchConnectedUsersNum() {
        setInterval(async () => {
            try {
                const response = await fetch('/api/status/connected-users');
                if (response.ok) {
                    const connectedUsersNum = await response.json;
                    console.log(connectedUsersNum);
                }
            } catch (error) {
                console.error("Error fetching connected users:", error);
            }
        }, 5000);
    }
}

export default LobbyScene;
