import ButtonComponent from '../Button/Button.mjs';

export default class ChatMiniComponent {
    constructor({ el } = {}) {
        this.el = el;
    }

    show() {
        console.log('показать чат');
        this.chat.hidden = false;
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
        console.log('render chat mini');

        this.renderBlock();

        const openButton = new ButtonComponent({
            el: this.openButton,
            className: 'js-router-ignore chat-component-open-btn',
            text: '<div class="temp"></div>',
        });
        openButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('открыть чат');
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

        this.iframeBlock = document.createElement('div');
        this.iframeBlock.className = 'chat-block__iframe-block';
        this.chat.appendChild(this.iframeBlock);

        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('width', 230);
        this.iframe.setAttribute('height', 300);
        this.iframe.setAttribute('src', 'js/Chat/chat.html');
        this.iframe.className = 'iframe-block__iframe';
        this.iframeBlock.appendChild(this.iframe);

        this.el.appendChild(this.chat);
    }
}
