/*
* @class WS
* @module modules
*/
import backDomain from '../projectSettings';
import bus from './EventBus';

export default class WS {

    ws;
    path;

    constructor(path = '/chat/ws') {
        const address = backDomain.replace('https', 'wss') + path;
        this.path = path;
        console.log(address);
        this.ws = new WebSocket(address);

        this.ws.onopen = (event) => {
            console.log('WebSocket opened');

            this.ws.onmessage = this.handleMessage.bind(this);

            this.ws.onclose = () => {
                bus.emit('ws:closed');
                console.log('WebSocket closed');
            };
        };
    }

    handleMessage(event) {
        const messageText = event.data;
        // console.log(`ws.handleMessage(${messageText})`);

        try {
            const message = JSON.parse(messageText);
            switch (this.path) {
               case '/chat/ws':
                   if (message.status) {
                       bus.emit(`ws:message${message.status}`, message);
                   } else {
                       // console.log(`ws.send(${message})`);
                       bus.emit('ws:message', message);
                   }
                   break;
                case '/game/ws':
                    if (message.status) {
                        bus.emit(`ws:${message.status}`, message);
                    } else {
                        // console.log(`ws.send(${message})`);
                        bus.emit('ws:message', message);
                    }
            }

        } catch (err) {
            console.error('Error in handleMessage: ', err);
        }
    }

    send(messageJSON) {
        // console.log(`ws.send(${messageJSON})`);
        this.ws.send(messageJSON);
    }

    close() {
        this.ws.close();
    }
}
