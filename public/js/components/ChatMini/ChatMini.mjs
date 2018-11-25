
import ButtonComponent from '../Button/Button.mjs';
import stateUser from '../../modules/User.mjs';

import bus from '../../modules/EventBus.js';

export default class ChatMiniComponent {
    constructor({ el, width = 230, height = 300 } = {}) {
        this.el = el;
        this.width = width;
        this.height = height;
    }

    show() {
        console.log('показать чат');
        this.chat.hidden = false;
        if (stateUser.isAuth() ) {
            this.userButton.hidden = false;
        } else {
            this.userButton.hidden = true;
        }
    }

    hide() {
        this.chat.hidden = true;
    }

    toggle() {
        if (this.chat.hidden) {
            this.show();
        } else {
            this.hide();
        }
    }

    render() {
        this.renderBlock();
        const iframe = this.el.querySelector('iframe');

        const userButton = new ButtonComponent({
            el: this.userButton,
            className: 'js-router-ignore chat-component-open-btn',
            text: '<div class="user-btn"></div>',
        });
        userButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('u чат');
                const mes = {
                    type: 'show-list',
                    userId: stateUser.getUser().id,
                    userNickName: stateUser.getUser().nickname,
                };

                iframe.contentWindow.postMessage(JSON.stringify(mes), '*');
            },
        });
        userButton.render();

        const openButton = new ButtonComponent({
            el: this.openButton,
            className: 'js-router-ignore chat-component-open-btn',
            text: '<div class="square"></div>',
        });
        openButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('открыть чат');
                // iframe.contentWindow.width = '100%';
                // iframe.contentWindow.height = '100%';
                // launchFullscreen(this.chat);
                this.hide();
                bus.emit('chat');
            },
        });
        openButton.render();
    }

    renderBlock() {
        this.chat = document.createElement('div');
        this.chat.className = 'chat-block chat-block--decoration';

        this.hide();

        this.chatHead = document.createElement('div');
        this.chatHead.className = 'chat-block__head-component';
        this.chat.appendChild(this.chatHead);

        this.nameBlock = document.createElement('div');
        this.nameBlock.className = 'head-component__name';
        this.chatHead.appendChild(this.nameBlock);
        this.nameBlock.innerHTML += '<p class"head-component__name--vertical">KetnipzChat</p>';

        this.openButton = document.createElement('div');
        this.openButton.className = 'head-component__open-button';
        this.chatHead.appendChild(this.openButton);

        this.userButton = document.createElement('div');
        this.openButton.appendChild(this.userButton);
        this.userButton.hidden = true;

        this.iframeBlock = document.createElement('div');
        this.iframeBlock.className = 'chat-block__iframe-block';
        this.chat.appendChild(this.iframeBlock);

        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('width', this.width);
        this.iframe.setAttribute('height', this.height);
        this.iframe.setAttribute('src', 'js/Chat/chat.html');
        this.iframe.className = 'iframe-block__iframe';
        this.iframeBlock.appendChild(this.iframe);

        this.el.appendChild(this.chat);
    }
}
