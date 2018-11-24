/*
* @class WS
* @module modules
*/
import backDomain from '../projectSettings.js';
import bus from './EventBus.js';

export default class WS {
    constructor() {
        const address = backDomain.replace('https', 'wss');
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

        try {
            const message = JSON.parse(messageText);
            bus.emit(`ws:${message.status}`, message);
        } catch (err) {
            console.error('Error in handleMessage: ', err);
        }
    }

    send(messageJSON) {
        this.ws.send(messageJSON);
    }
}
