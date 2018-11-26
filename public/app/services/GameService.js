import WS from '../modules/WebSocket.js';
import bus from '../modules/EventBus.js';

export default class GameService {
    constructor() {
        console.log('GameService()');
    }

    connectWS() {
        this.ws = new WS();
        bus.on('ws:connected', this.onConnected.bind(this) );
        bus.on('ws:state', this.onState.bind(this) );
        bus.on('ws:started', this.onStart.bind(this) );
        bus.on('ws:disconnected', this.onDisconnected.bind(this) );
        bus.on('ws:time_over', this.onTimeOver.bind(this) );
        bus.on('ws:game_over', this.onGameOver.bind(this) );
    }

    onConnected(json) {
        // TODO
    }

    onStart(json) {

    }


    onState(json) {

    }

    onDisconnected(json) {
        this.destroy();
    }

    onTimeOver(json) {
        this.destroy();
    }

    onGameOver(json) {
        this.destroy();
    }

    sendActions(actions) {
        const json = JSON.stringify(actions);
        this.ws.send(json);
    }

    destroy() {
        // TODO возможно надо закрыть WebSocket
        bus.off('ws:connected', this.onConnected.bind(this) );
        bus.off('ws:state', this.onState.bind(this) );
        bus.off('ws:started', this.onStart.bind(this) );
        bus.off('ws:disconnected', this.onDisconnected.bind(this) );
        bus.off('ws:time_over', this.onTimeOver.bind(this) );
        bus.off('ws:game_over', this.onGameOver.bind(this) );
    }
}
