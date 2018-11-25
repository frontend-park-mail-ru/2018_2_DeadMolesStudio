/*
* @class WS
* @module modules
*/
import backDomain from '../projectSettings.js';
import bus from './EventBus.js';

export default class WS {
    constructor() {
        const address = backDomain.replace('https', 'wss') + '/chat/ws';
        console.log(address);
        this.ws = new WebSocket(address);

        this.ws.onopen = (event) => {
            console.log('WebSocket opened');

            this.ws.onmessage = this.handleMessage.bind(this);

            this.ws.onclose = () => {
                console.log('WebSocket closed');
            };
        };
    }

    handleMessage(event) {
        const messageText = event.data;
        console.log(`ws.handleMessage(${messageText})`);

        try {
            const message = JSON.parse(messageText);
            if (message.status) {
                bus.emit(`ws:message${message.status}`, message);
            } else {
                console.log(`ws.send(${message})`);
                bus.emit('ws:message', message);
            }
        } catch (err) {
            console.error('Error in handleMessage: ', err);
        }
    }

    send(messageJSON) {
        console.log(`ws.send(${messageJSON})`);
        this.ws.send(messageJSON);
    }
}
