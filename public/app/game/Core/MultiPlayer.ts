import GameCore from './GameCore';
import EVENTS from './Events';
import bus from '../../modules/EventBus';
import GameService from '../../services/GameService';

// percentsX считаю в процентах слева направо
// percentsY считаю в процентах снизу вверх
export default class MultiPlayerGame extends GameCore {

    lastFrame;
    gameloopRequestId;
    secsIntervalID;
    opponentID;
    endTimerID;

    gameService;

    state;
    playerNum;
    playerName;
    opponentName;
    gameTime;

    constructor(controller, scene) {
        console.log('MultiPlayerGame()');
        super(controller, scene);
        this.state = {};
        this.lastFrame = 0;
        this.gameloopRequestId = null;
        this.gameService = new GameService();
        this.gameloop = this.gameloop.bind(this);
        this.connect(null);

        this.handleState = this.handleState.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleTimeOver = this.handleTimeOver.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);
        this.handleClosedWS = this.handleClosedWS.bind(this);
    }

    connect(json) {
        this.gameService.connectWS();
        bus.on('ws:started', this.start.bind(this) );
    }

    start(json) {
        console.log('multi.start()');
        super.start(json);
        bus.on('ws:state', this.handleState);
        bus.on('ws:disconnected', this.handleDisconnect);
        bus.on('ws:time_over', this.handleTimeOver);
        bus.on('ws:game_over', this.handleGameOver);
        bus.on('ws:closed', this.handleClosedWS);

        const { opponentID, playerNum, stateConst } = json.payload;
        this.opponentID = opponentID;

        // TODO тут можно сделать bus.emit('fetch-opponent') и подтягивать аву и ник

        this.playerNum = playerNum;
        this.playerName = `player${this.playerNum}`;
        this.opponentName = `player${3 - this.playerNum}`;
        this.gameTime = stateConst.gameTime / 1000000000;

        this.state.productWidth = 5; // TODO ?
        this.state.productHeight = 5; // TODO ?



        this.state[this.opponentName] = {
            direction: 'RIGHT',
            width: 10,
            height: 18,
            targetList: [],
            score: 0,
        };

        this.state[this.playerName] = {
            direction: 'RIGHT',
            width: 10,
            height: 18,
            targetList: [],
            score: 0,
        };

        this.state.playerName = this.playerName;
        this.state.opponentName = this.opponentName;
        this.state.leftTime = this.gameTime;
        this.state.products = [];
        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            clearInterval(this.secsIntervalID);
            clearTimeout(this.endTimerID);
            cancelAnimationFrame(this.gameloopRequestId);
            this.stopController();
            // TODO вот тут возможно стоит ждать финиша от сервера а не самим выводить резалт
            // bus.emit(EVENTS.FINISH_GAME, this.state.score);
        }, this.gameTime * 1000);

        this.secsIntervalID = setInterval( () => {
            this.gameTime -= 1;
            this.state.leftTime = this.gameTime;
        }, 1000);
    }

    handleState(json) {
        console.log('handleState', json);
        const { playerName, opponentName } = this;
        const me = json.payload[this.playerName];
        const opponent = json.payload[this.opponentName];
        const { collected, products } = json.payload;


        this.state[playerName].percentsX = me.percentsX;
        this.state[playerName].percentsY = me.percentsY;
        this.state[playerName].targetList = me.targetList;
        this.state[playerName].score = me.score;

        const prevOpponentPercentsX = this.state[opponentName].percentsX;
        const curOpponentPercentsX = opponent.percentsX;
        if (prevOpponentPercentsX !== curOpponentPercentsX) {
            this.state[opponentName].direction = prevOpponentPercentsX < curOpponentPercentsX ? 'RIGHT' : 'LEFT';
        }
        this.state[opponentName].percentsX = curOpponentPercentsX;
        this.state[opponentName].percentsY = opponent.percentsY;
        this.state[opponentName].targetList = opponent.targetList;
        this.state[opponentName].score = opponent.score;

        this.state.collectedProducts = collected;
        this.state.products = products;
    }

    handleDisconnect(json) {
        bus.emit('show-game-result', { text: 'Противник покинул игру(', score: this.state.player1.score });
        bus.off('ws:closed', this.handleClosedWS );

        // bus.emit('multiplayer:finish-disconnect', this.state);
    }

    handleTimeOver(json) {
        bus.emit('show-game-result', { text: 'Финиш!', score: this.state.player1.score });
        bus.off('ws:closed', this.handleClosedWS );

        // bus.emit('multiplayer:finish-timeover', this.state);
    }

    handleGameOver(json) {
        bus.emit('show-game-result', { text: 'Финиш!', score: this.state.player1.score });
        bus.off('ws:closed', this.handleClosedWS );

        // bus.emit('multiplayer:finish-gameover', this.state);
    }

    handleClosedWS() {
        bus.emit('show-game-result', { text: 'Соединение прервано(', score: this.state.player1.score });

        // bus.emit('multiplayer:finish-closed-ws', this.state);
    }

    destroy() {
        clearTimeout(this.endTimerID);
        cancelAnimationFrame(this.gameloopRequestId);
        this.gameService.destroy();
        super.destroy();
    }

    // TODO по идее этот метод не нужен :(
    gameloop(now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;

        bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);

        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onControlsPressed(event) {
        let actions = 0;
        if (this.pressed('LEFT', event) ) {
            actions += 4;
            this.state[this.playerName].direction = 'LEFT'; // TODO ?
        }
        if (this.pressed('RIGHT', event) ) {
            actions += 1;
            this.state[this.playerName].direction = 'RIGHT';
        }
        if (this.pressed('JUMP', event) ) {
            actions += 2;
        }

        this.gameService.sendActions({ actions: +actions.toString(2) });
    }

    onGameStarted(event) {
        this.controller.start();
        this.scene.init(event);
        this.scene.start();

        this.lastFrame = performance.now();
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onGameFinished(scores) {
        cancelAnimationFrame(this.gameloopRequestId);
        bus.emit(EVENTS.CLOSE_GAME, scores);
        this.gameService.destroy();
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
