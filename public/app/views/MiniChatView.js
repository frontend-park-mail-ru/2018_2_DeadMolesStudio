import BaseView from './Base.ts';
import WS from '../modules/WebSocket.js';
import ChatComponent from '../components/ChatComponent/ChatComponent.ts';
import bus from '../modules/EventBus.js';
import UserService from '../services/UserService.js';
import ListComponent from '../components/ListComponent/ListComponent.ts';


export default class MiniChatView extends BaseView {
    constructor({ el }) {
        super(el);
        this.el = el;
        this.ws = new WS();
        this.users = {};
        bus.on('ws:message', this.handleMessage.bind(this) );
        bus.on('chat-comp:send-message', this.sendMessage.bind(this) );
        window.addEventListener('message', (event) => {
            const json = JSON.parse(event.data);
            // console.log(json);
            if (json.type === 'show-list') {
                this.showListUsers();
            }
        });
        window.addEventListener('message', (event) => {
            const json = JSON.parse(event.data);
            // console.log(json);
            if (json.type === 'set-user') {
                this.userId = json.userId;
                this.userNickName = json.userNickName;
            }
        });
    }

    show() {
        // console.log(this.el);
        this.el.hidden = false;
    }

    showListUsers() {
        this.chatComponent.chatBlock.innerHTML = '';
        // this.users = {
        //   1: 'Вася',
        //   2: 'Петя',
        // };
        this.listComponent = new ListComponent({ el: this.content, users: this.users });
        this.listComponent.render();
    }

    showPublicChat() {
        this.listComponent.chatBlock.innerHTML = '';
        this.chatComponent = new ChatComponent({ el: this.content});
        this.chatComponent.render();
    }

    handleMessage(json) {
        if (json.action === 'send') {
            const message = json.payload;
            const {author, message: text} = message;
            // console.log(`тип сделал запрос за автором с id=${author}`);
            let nickname = 'Аноним';
            if (author) {
                if (this.users[author]) {
                    this.chatComponent.appendMessage({nickname: this.users[author], text});
                    return;
                }

                let data = null;
                const f = async () => {
                    data = await UserService.getUserByID(author);
                    if (data.ok) {
                        nickname = data.user.nickname;
                        // console.log(data.user);
                        this.chatComponent.appendMessage({nickname, text});
                        if (!this.users[author]) {
                            this.users[author] = nickname;
                        }
                        return;
                    }
                    nickname = 'Аноним (не найдено)';
                    this.chatComponent.appendMessage({nickname, text});
                };
                f();
                // const data = UserService.fetchUserByID(author);

                return;
            }
            this.chatComponent.appendMessage({nickname, text});
        } else if (json.action === 'get') {
            // console.log("GET----------");
            const messages = json.payload.messages;
            // console.log('GET', messages);
            messages.forEach( message => {
                const { author, message: text } = message;
                // console.log('iter');
                let nickname = 'Аноним';
                if (author) {
                    if (this.users[author]) {
                        this.chatComponent.appendMessage({ nickname: this.users[author], text });
                        return;
                    }

                    let data = null;
                    const f = async () => {
                        data = await UserService.getUserByID(author);
                        if (data.ok) {
                            nickname = data.user.nickname;
                            // console.log(data.user);
                            this.chatComponent.appendMessage({ nickname, text });
                            if (!this.users[author]) {
                                this.users[author] = nickname;
                            }
                            return;
                        }
                        nickname = 'Аноним (не найдено)';
                        this.chatComponent.appendMessage({ nickname, text });
                    };
                    f();
                    // const data = UserService.fetchUserByID(author);

                    return;
                }
                this.chatComponent.appendMessage({ nickname, text });
            });
            // for (let i = 0; i < messages.length; i++) {
            //     const { author, message: text } = messages[i];
            //     console.log('iter');
            //     let nickname = 'Аноним';
            //     if (author) {
            //         if (this.users[author]) {
            //             this.chatComponent.appendMessage({ nickname: this.users[author], text });
            //             return;
            //         }
            //
            //         let data = null;
            //         const f = async () => {
            //             data = await UserService.getUserByID(author);
            //             if (data.ok) {
            //                 nickname = data.user.nickname;
            //                 console.log(data.user);
            //                 this.chatComponent.appendMessage({ nickname, text });
            //                 if (!this.users[author]) {
            //                     this.users[author] = nickname;
            //                 }
            //                 return;
            //             }
            //             nickname = 'Аноним (не найдено)';
            //             this.chatComponent.appendMessage({ nickname, text });
            //         };
            //         f();
            //         // const data = UserService.fetchUserByID(author);
            //
            //         return;
            //     }
            //     this.chatComponent.appendMessage({ nickname, text });
            // }
        }
    }

    sendMessage(text) {
        const mes = {
            payload: {
                message: text,
            },
            action: 'send',
        };
        // console.log(`Отправлено: ${mes}`);
        this.ws.send(JSON.stringify(mes) );
    }

    render() {
        super.render();
        this.show();
        this.content = this._el.querySelector('.content');
        const title = this._el.querySelector('.game_title');
        this.content.removeChild(title);

        this.chatComponent = new ChatComponent({ el: this.content });
        this.chatComponent.render();

        const getMes = {
            action: 'get',
        };
        setTimeout( () => this.ws.send(JSON.stringify(getMes) ), 2 * 1000);
        this.listComponent = new ListComponent({ el: this.content, users: this.users });
        this.listComponent.render();
    }
}
