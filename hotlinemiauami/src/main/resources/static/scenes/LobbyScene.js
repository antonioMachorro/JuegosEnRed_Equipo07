class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
        this.fetchIntervalId = null;
    }

    preload() {
        // Cargar imágenes y sprites
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('volver', './Interfaz/volver.png');

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

    create() {
        const { width, height } = this.scale;
        const userData = this.registry.get('userData');

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
            this.scene.start('GameModeScene');
        });

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

        const policia = this.add.sprite(1125, 550, "policia");
        policia.play("police_run");
    
        const ladron = this.add.sprite(1200, 550, "ladron");
        ladron.play("thief_run");

        // Titulo escena
        this.add.text(width / 2, 100, 'CHAT', { 
            fontFamily: 'Arial', 
            fontSize: '120px', 
            fill: '#fff' 
        });

        // Limpiar el chat y ocultarlo cuando se cierra la escena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.clearChat();
            this.hideChat();
        });

        // Inicializar el chat
        this.initChat(userData.username);
        this.fetchMessages();

        this.add.text(845, 395, 'Chat', {
            fontFamily: 'retro-computer',
            fontSize: '16px',
            fill: '#ffffff'
        });
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

    initChat(username) {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        const newChat = chatInput.cloneNode(true);
        chatInput.parentNode.replaceChild(newChat, chatInput);

        newChat.addEventListener('keydown', async (event) => {
            if (event.key === 'Enter' && newChat.value.trim() !== '') {
                const message = newChat.value.trim();
                newChat.value = ''; // Limpiar el campo de entrada

                // Enviar el mensaje al servidor
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: username,
                            message: message,
                        }),
                    });

                    if (!response.ok) {
                        console.error("Error al enviar el mensaje: ", await response.text());
                    }
                } catch (error) {
                    console.error("Error al conectar con servidor: ", error);
                }

                // Hacer scroll al final de los mensajes
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
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
                    messages.forEach((message) => {
                        // Filtrar palabras malsonantes
                        const filteredMessage = this.filterProfanity(message.message);

                        const messageElement = document.createElement('div');
                        messageElement.textContent = `${message.user}: ${filteredMessage}`;
                        chatMessages.appendChild(messageElement);
                        lastMessageId = message.id;
                    });

                    chatMessages.scrollTop = chatMessages.scrollHeight;
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
