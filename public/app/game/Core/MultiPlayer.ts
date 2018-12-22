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
    result;

    constructor(controller, scene) {
        super(controller, scene);
        this.state = {};
        this.lastFrame = 0;
        this.gameloopRequestId = null;
        this.gameService = new GameService();
        this.result = null;

        this.gameloop = this.gameloop.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleTimeOver = this.handleTimeOver.bind(this);
        this.handleGameOver = this.handleGameOver.bind(this);
        this.handleClosedWS = this.handleClosedWS.bind(this);
        this.handlePlaying = this.handlePlaying.bind(this);

        this.connect(null);
    }

    connect(json) {
        this.gameService.connectWS();
        bus.on('ws:started', this.start);
    }

    start = (json) => {
        super.start(json);
        bus.on('ws:state', this.handleState);
        bus.on('ws:disconnected', this.handleDisconnect);
        bus.on('ws:time_over', this.handleTimeOver);
        bus.on('ws:game_over', this.handleGameOver);
        bus.on('ws:closed', this.handleClosedWS);
        bus.on('ws:playing', this.handlePlaying);


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
        this.state.playerNum = this.playerNum;
        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            clearInterval(this.secsIntervalID);
        }, this.gameTime * 1000);

        this.secsIntervalID = setInterval( () => {
            this.gameTime -= 1;
            this.state.leftTime = this.gameTime;
        }, 1000);
    };

    updateUser() {
        const data = {
            result: this.result,
            record: this.state[this.playerName].score,
        };
        bus.emit('setUserAfterGame', data);
    }

    handleState(json) {
        const { playerName, opponentName } = this;
        const me = json.payload[this.playerName];
        const opponent = json.payload[this.opponentName];
        const { collected, products } = json.payload;


        this.state[playerName].percentsX = me.X;
        this.state[playerName].percentsY = me.Y;
        this.state[playerName].targetList = me.targetList;
        this.state[playerName].score = me.score;

        const prevOpponentPercentsX = this.state[opponentName].percentsX;
        const curOpponentPercentsX = opponent.X;
        if (prevOpponentPercentsX !== curOpponentPercentsX) {
            this.state[opponentName].direction = prevOpponentPercentsX < curOpponentPercentsX ? 'RIGHT' : 'LEFT';
        }
        this.state[opponentName].percentsX = curOpponentPercentsX;
        this.state[opponentName].percentsY = opponent.Y;
        this.state[opponentName].targetList = opponent.targetList;
        this.state[opponentName].score = opponent.score;


        if (collected) {
            this.state.collected = collected.map(({ X, Y, points, playerNum }) => ({
                percentsX: X,
                percentsY: Y,
                points,
                playerNum,
            }));
        } else {
            this.state.collected = [];
        }
        if (products) {
            this.state.products = products.map(({ X, Y, type }) => ({
                percentsX: X,
                percentsY: Y,
                type,
            }));
        } else {
            this.state.products = [];
        }
    }

    handleDisconnect(json) {
        this.result = 'win';
        this.updateUser();
        bus.emit('show-game-result', { text: 'You won! The opponent left the game. ', score: this.state[this.playerName].score });
        bus.off('ws:closed', this.handleClosedWS );
        bus.emit('multiplayer:end');
    }

    handleTimeOver(json) {
        const myScore = this.state[this.playerName].score;
        const opponentScore = this.state[this.opponentName].score;
        let text = '';
        if (myScore >= 0) {
            if (myScore > opponentScore) {
                this.result = 'win';
                text = 'You won!';
            } else if (myScore === opponentScore) {
                this.result = 'draw';
                text = 'Draw ;)';
            } else {
                this.result = 'lose';
                text = 'You lose :(';
            }
        } else {
            if (opponentScore >= 0) {
                this.result = 'lose';
                text = 'You lose :(';
            } else {
                this.result = 'draw';
                text = 'Draw ;)';
            }
        }
        this.updateUser();
        bus.emit('show-game-result', { text: `Time is over. ${text}`, score: this.state[this.playerName].score });
        bus.off('ws:closed', this.handleClosedWS );
        bus.emit('multiplayer:end');
    }

    handleGameOver(json) {
        const myScore = this.state[this.playerName].score;
        const opponentScore = this.state[this.opponentName].score;
        let text = '';
        if (myScore >= 0) {
            if (myScore > opponentScore) {
                this.result = 'win';
                text = 'You won!';
            } else if (myScore === opponentScore) {
                this.result = 'draw';
                text = 'Draw ;)';
            } else {
                this.result = 'lose';
                text = 'You lose :(';
            }
        } else {
            this.result = 'draw';
            text = 'Draw ;)';
        }

        this.updateUser();

        bus.emit('show-game-result', { text: `Game over. ${text}`, score: this.state[this.playerName].score });
        bus.off('ws:closed', this.handleClosedWS );
        bus.emit('multiplayer:end');
    }

    handleClosedWS() {
        bus.emit('show-game-result', { text: 'Сonnection aborted :( Try again.', score: this.state[this.playerName].score });
        bus.emit('multiplayer:end');
    }

    handlePlaying() {

    }

    destroy() {
        bus.off('ws:started', this.start);
        bus.off('ws:state', this.handleState);
        bus.off('ws:disconnected', this.handleDisconnect);
        bus.off('ws:time_over', this.handleTimeOver);
        bus.off('ws:game_over', this.handleGameOver);
        bus.off('ws:closed', this.handleClosedWS);
        bus.off('ws:playing', this.handlePlaying);

        this.gameService.destroy();
        clearTimeout(this.endTimerID);
        clearInterval(this.secsIntervalID);
        cancelAnimationFrame(this.gameloopRequestId);
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
        if (actions === 101 || actions === 0) return;
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
        bus.emit(EVENTS.CLOSE_GAME, scores);
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
