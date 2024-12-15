class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
    }

    preload() {
        // Cargar imágenes
        this.load.image('fondo', './Interfaz/champSelect.png');
        this.load.image('volver', './Interfaz/volver.png');
    }

    create() {

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
        this.initChat();
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

    initChat() {
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        // Enviar mensaje al presionar Enter
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && chatInput.value.trim() !== '') {
                const message = chatInput.value.trim();
                chatInput.value = ''; // Limpiar el campo de entrada

                // Mostrar el mensaje localmente
                const messageElement = document.createElement('div');
                messageElement.textContent = `Tú: ${message}`;
                chatMessages.appendChild(messageElement);

                // Hacer scroll al final de los mensajes
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
}

export default LobbyScene;
