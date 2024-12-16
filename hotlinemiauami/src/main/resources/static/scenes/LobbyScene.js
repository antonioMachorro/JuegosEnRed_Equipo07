class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
        this.fetchIntervalId = null;
    }

    preload() {
        // Cargar imágenes
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {

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

        // Limpiar el chat y ocultarlo cuando se cierra la escena
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.clearChat();
            this.hideChat();
        });

        // Inicializar el chat
        this.initChat(userData.username);
        this.fetchMessages();
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

                //Enviar el mensaje a servidor
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

                    if(!response.ok) {
                        console.error("Error al enviar el mensaje: ", await response.text());
                    }
                } catch(error) {
                    console.error("Error al conectar con servidor: ", error);
                }


                // Hacer scroll al final de los mensajes
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }

    async fetchMessages() {
        const chatMessages = document.getElementById('chat-messages');
        let lastMessageId = 0;

        this.clearFetchInterval();

        console.log("Fetching messages...");

        this.fetchIntervalId = setInterval(async () => {
            try {
                const response = await fetch(`api/chat?since=${lastMessageId}`);
                if(response.ok) {
                    const messages = await response.json();
                    messages.forEach((message) => {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = `${message.user}: ${message.message}`;
                        chatMessages.appendChild(messageElement);
                        lastMessageId = message.id;
                    });

                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            } catch(error) {
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

}

export default LobbyScene;
