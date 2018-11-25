import BaseView from './Base.js';
import WS from '../modules/WebSocket.js';
import ChatComponent from '../components/ChatComponent/ChatComponent.mjs';
import bus from '../modules/EventBus.js';


export default class MiniChatView extends BaseView {
    constructor({ el }) {
        super(el);
        this.el = el;
        this.ws = new WS();
        bus.on('ws:message', this.handleMessage.bind(this) );
        bus.on('chat-comp:send-message', this.sendMessage.bind(this) );
    }

    show() {
        console.log(this.el);
        this.el.hidden = false;
    }

    handleMessage(message) {
        const { author, message: text } = message;
        console.log(`тип сделал запрос за автором с id=${author}`);
        this.chatComponent.appendMessage({ author, text });
    }

    sendMessage(text) {
        const mes = {
            message: text,
        };
        console.log(`Отправлено: ${mes}`);
        this.ws.send(JSON.stringify(mes) );
    }

    render() {
        super.render();
        this.show();
        const content = this._el.querySelector('.content');
        const title = this._el.querySelector('.game_title');
        content.removeChild(title);

        this.chatComponent = new ChatComponent({ el: content });
        this.chatComponent.render();
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'Тег является контейнером, содержание которого игнорируется браузерами, не поддерживающими данный тег. Для таких браузеровТег является контейнером, содержание которого игнорируется браузерами, не поддерживающими данный тег. Для таких браузеровТег является контейнером, содержание которого игнорируется браузерами, не поддерживающими данный тег. Для таких браузеров' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
        this.handleMessage({ author: 'хардкод', message: 'ghbdtn' });
         // this.handleMessage({ author: 'хардкод', message: 'Тег является контейнером, содержание которого игнорируетсяТег является контейнером, содержание которого игнорируется браузерами, не поддерживающими данный тег. Для таких браузеровТег является контейнером, содержание которого игнорируется браузерами, не поддерживающими данный тег. Для таких браузеров браузерами, не поддерживающими данный тег. Для таких браузеров можно указать альтернативный текст, который увидят пользователи. Он должен располагаться между элементами и ' });
    }
}
