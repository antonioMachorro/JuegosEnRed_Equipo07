class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
    }

    preload(){
        this.load.html('chat', 'chat.html');
    }

    create() {
        const chatElement = this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2)
            .createFromCache('chat');
        chatElement.setOrigin(0.5);

        const chatMessages = chatElement.getChildByID('chat-messages');
        const chatInput = chatElement.getChildByID('chat-input');
        const sendButton = chatElement.getChildByID('send-button');

        const fetchMessages = () => {
            const lastMessageId = chatMessages.dataset.lastMessageId || 0;
            $.get(`/api/chat?since=${lastMessageId}`,
                (data) => {
                    data.forEach(message => {
                        const messageDiv = document.createElement('div');
                        messageDiv.innerHTML = `<strong>${message.user}</strong>`
                    })
                }
            )
        }

        const sendMessage = () => {
            const message = chatInput.value.trim();

            if(message){
                $.ajax({
                    url: '/api/chat',
                    type: 'POST',
                    contentType: 'aplication/json',
                    data: JSON.stringify({user: 'User1', message: message}),
                    success: () => {
                        chatInput.value = '';
                        console.log("Message sent successfully");
                    },
                    error: (xhr, status, error) => {
                        console.log("Error sending message:", status);
                    }
                })
            }
        };

        sendButton.addEventListener()

        this.time.addEvent({
            delay: 1000,
            callback: fetchMessages,
            loop: true
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.stop();
        })
    }
}

export default ChatScene;
