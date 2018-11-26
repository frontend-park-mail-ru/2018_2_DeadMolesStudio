import bus from '../../modules/EventBus.js';

export default class ChatComponent {
    constructor({ el = document.body }) {
        this.el = el;
    }

    render() {
        this.chatBlock = document.createElement('div');
        this.chatBlock.classList.add('chat-component');
        this.chatBlock.innerHTML = `
            <div class="chat-component__chat-field">
            </div>
            <div class="chat-component__control-block">
                <div class="control-block__send-btn"></div>
                <input type="text" class="control-block__chat-input" placeholder="Введите сообщение">
            </div>
        `;

        this.el.appendChild(this.chatBlock);
        this.chatField = this.el.querySelector('.chat-component__chat-field');
        this.messageInput = document.querySelector('.control-block__chat-input');

        window.addEventListener('keydown', (e) => {
            // console.log(e.key.toLowerCase());
            if (e.key.toLowerCase() === 'enter') {
                if (this.messageInput.value) {
                    bus.emit('chat-comp:send-message', this.messageInput.value);
                    this.messageInput.value = '';
                }
            }
        });
    }

    appendMessage(message) {
        const newMessage = `<div class="chat-field__chat-message"><span class="chat-message__message-author ${message.my ? 'chat-message--my-message' : ''}">[${message.nickname}]: </span>${message.text}</div>`;
        this.chatField.insertAdjacentHTML('afterbegin', newMessage);
    }
}
