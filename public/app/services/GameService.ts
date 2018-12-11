import WS from '../modules/WebSocket';
import bus from '../modules/EventBus';
import UserService from "./UserService";

export default class GameService {

    ws;
    
    constructor() {
        console.log('GameService()');
    }

    connectWS() {
        this.ws = new WS('/game/ws');
        bus.on('ws:connected', this.onConnected.bind(this) );
        bus.on('ws:state', this.onState.bind(this) );
        bus.on('ws:started', this.onStart.bind(this) );
        bus.on('ws:disconnected', this.onDisconnected.bind(this) );
        bus.on('ws:time_over', this.onTimeOver.bind(this) );
        bus.on('ws:game_over', this.onGameOver.bind(this) );
        bus.on('ws:closed', this.onClosed.bind(this) );
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
        bus.off('ws:connected', this.onConnected.bind(this) );
        bus.off('ws:state', this.onState.bind(this) );
        bus.off('ws:started', this.onStart.bind(this) );
        bus.off('ws:disconnected', this.onDisconnected.bind(this) );
        bus.off('ws:time_over', this.onTimeOver.bind(this) );
        bus.off('ws:game_over', this.onGameOver.bind(this) );
    }
}
