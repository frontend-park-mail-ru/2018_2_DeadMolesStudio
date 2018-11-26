import ButtonComponent from "../components/Button/Button.mjs";

import BaseView from './Base.js';

import SectionComponent from '../components/Section/Section.mjs';

export default class ChatView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const chatSection = new SectionComponent({ el: content, name: 'login' });
        chatSection.render();
        const chatSectionContent = chatSection.sectionContent;

        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('width', '1000');
        this.iframe.setAttribute('height', '400');
        this.iframe.setAttribute('src', 'app/chat/chat.html');
        chatSectionContent.appendChild(this.iframe);

        const button = document.querySelector('.chat-mini-bth');
        const style = button.style.display;
        button.style.display = 'none';

        const menuButton = new ButtonComponent({ el: chatSectionContent });
        menuButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                button.style.display = style;
            },
        });
        menuButton.render();
    }
}
