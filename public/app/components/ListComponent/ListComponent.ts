import bus from 'modules/EventBus.js';

export default class ListComponent {

    el;
    users;
    chatBlock;
    chatField;
    messageInput;

    constructor({ el = document.body, users = {} }) {
        this.el = el;
        this.users = users;

        this.chatField = null;
        this.messageInput = null;
        this.chatBlock = null;
    }

    render() {
        this.chatBlock = document.createElement('div');
        this.chatBlock.classList.add('chat-component');
        this.chatBlock.innerHTML = `
            <div class="chat-component__chat-field">
            </div>
        `;

        this.el.appendChild(this.chatBlock);
        this.chatField = this.el.querySelector('.list-component__list-field');
        this.messageInput = document.querySelector('.control-block__chat-input');

        Object.keys(this.users).forEach( id => this.appendUser({ nickname: this.users[id] }) );
    }

    appendUser(user) {
        const userBlock = `<div class="chat-field__chat-message"><span class="chat-message__message-author">[${user.nickname}]: </span>${'Написать\uD83D\uDCE9'}</div>`;
        this.chatField.insertAdjacentHTML('afterbegin', userBlock);
    }
}
