import GameCore from './GameCore.js';
import EVENTS from './Events.js';
import bus from '../../modules/EventBus.js';
import { randInt } from '../../modules/Utils.mjs';
import GameService from '../../services/GameService.js';

// percentsX считаю в процентах слева направо
// percentsY считаю в процентах снизу вверх
export default class MultiPlayerGame extends GameCore {
    constructor(controller, scene) {
        console.log('MultiPlayerGame()');
        super(controller, scene);
        this.state = {};
        this.lastFrame = 0;
        this.gameloopRequestId = null;
        this.gameService = new GameService();
        this.gameloop = this.gameloop.bind(this);
    }

    connect(json) {
        this.gameService.connectWS();
        bus.on('ws:start', this.start.bind(this) );
    }

    start(json) {
        super.start();
        bus.on('ws:state', this.handleState.bind(this) );
        bus.on('ws:disconnected', this.handleDisconnect.bind(this) );
        bus.on('ws:time_over', this.handleTimeOver.bind(this) );
        bus.on('ws:game_over', this.handleGameOver.bind(this) );

        const { opponentID, playerNum, stateConst } = json;
        this.opponentID = opponentID;

        // TODO тут можно сделать bus.emit('fetch-opponent') и подтягивать аву и ник

        this.playerNum = playerNum;
        this.playerName = `player${this.playerNum}`;
        this.opponentName = `player${3 - this.playerNum}`;
        this.gameTime = stateConst.gameTime;

        this.state.productWidth = 5; // TODO ?
        this.state.productHeight = 5; // TODO ?


        this.state.leftTime = this.gameTime;
        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            console.log('FINISH!!!!');
            alert('Время вышло!');
            clearInterval(this.secsInervalID);
            // TODO вот тут возможно стоит ждать финиша от сервера а не самим выводить резалт
            bus.emit(EVENTS.FINISH_GAME, this.state.score);
        }, this.gameTime * 1000);

        this.secsInervalID = setInterval( () => {
            this.gameTime -= 1;
            this.state.leftTime = this.gameTime;
        }, 1000);
    }

    handleState(json) {
        const me = json[this.playerName];
        const opponent = json[this.opponentName];
        const { collected, products } = json;

        this.state.me.percentsX = me.percentsX;
        this.state.me.percentsY = me.percentsY;
        this.state.me.targetList = me.targetList;
        this.state.me.score = me.score;


        this.state.opponent.percentsX = opponent.percentsX;
        this.state.opponent.percentsY = opponent.percentsY;
        this.state.opponent.targetList = opponent.targetList;
        this.state.opponent.score = opponent.score;

        this.state.collectedProducts = collected;
        this.state.products = products;
    }

    handleDisconnect(json) {
        bus.emit('multiplayer:finish-disconnect', this.state);
    }

    handleTimeOver(json) {
        bus.emit('multiplayer:finish-timeover', this.state);
    }

    handleGameOver(json) {
        bus.emit('multiplayer:finish-gameover', this.state);
    }

    destroy() {
        console.log('DESTROOOOY!');
        clearTimeout(this.endTimerID);
        cancelAnimationFrame(this.gameloopRequestId);
        this.gameService.destroy();
        super.destroy();
    }

    // TODO по идее этот метод не нужен :(
    // gameloop(now) {
    //     const delay = now - this.lastFrame;
    //     this.lastFrame = now;
    //
    //     bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
    //
    //     this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    // }

    onControlsPressed(event) {
        const actions = [];
        if (this.pressed('LEFT', event) ) {
            actions.push('LEFT');
            this.state.me.direction = 'LEFT'; // TODO ?
        }
        if (this.pressed('RIGHT', event) ) {
            actions.push('RIGHT');
            this.state.me.direction = 'RIGHT';
        }
        if (this.pressed('JUMP', event) ) {
            actions.push('JUMP');
        }
        if (actions.length !== 0) {
            this.gameService.sendActions(actions);
        }
    }

    onGameStarted(event) {
        this.controller.start();
        this.scene.init(event);
        this.scene.start();

        this.lastFrame = performance.now();
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onGameFinished(scores) {
        console.log('gameFinished()');
        cancelAnimationFrame(this.gameloopRequestId);
        bus.emit('CLOSE GAME', scores);
        this.gameService.destroy();
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
