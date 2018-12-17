import WS from '../modules/WebSocket';
import bus from '../modules/EventBus';
import UserService from "./UserService";

export default class GameService {

    ws;
    
    constructor() {
        this.onConnected = this.onConnected.bind(this);
        this.onState = this.onState.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onDisconnected = this.onDisconnected.bind(this);
        this.onTimeOver = this.onTimeOver.bind(this);
        this.onGameOver = this.onGameOver.bind(this);
        this.onClosed = this.onClosed.bind(this);
    }

    connectWS() {
        this.ws = new WS('/game/ws');
        bus.on('ws:connected', this.onConnected);
        bus.on('ws:state', this.onState);
        bus.on('ws:started', this.onStart);
        bus.on('ws:disconnected', this.onDisconnected);
        bus.on('ws:time_over', this.onTimeOver);
        bus.on('ws:game_over', this.onGameOver);
        bus.on('ws:closed', this.onClosed);
    }

    onConnected(json) {
        // TODO
    }

    onStart(json) {
        console.log(json);
        let nickname = '';
        const f = async () => {
            const data = await UserService.getUserByID(json.payload.opponentId);
            if (data.ok) {
                nickname = data.user.nickname;
            } else {
                nickname = 'Opponent';
            }
            console.log('gameService, data:', data);
            console.log('json:', json);
            bus.emit('ws:opponent_received', nickname);
        };
        f().catch( err => console.error(err));
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

    onClosed() {
        this.destroy();
    }

    sendActions(actions) {
        const json = JSON.stringify(actions);
        this.ws.send(json);
    }

    destroy() {
        // TODO возможно надо закрыть WebSocket
        this.ws.close();
        bus.off('ws:connected', this.onConnected);
        bus.off('ws:state', this.onState);
        bus.off('ws:started', this.onStart);
        bus.off('ws:disconnected', this.onDisconnected);
        bus.off('ws:time_over', this.onTimeOver);
        bus.off('ws:game_over', this.onGameOver);
    }
}
