import GameCore from './GameCore.js';
import EVENTS from './Events.js';
import bus from '../../modules/EventBus.js';
import { randInt } from '../../modules/Utils.mjs';

// percentsX считаю в процентах слева направо
// percentsY считаю в процентах снизу вверх
export default class OfflineGame extends GameCore {
    constructor(controller, scene) {
        console.log('OfflineGame()');
        super(controller, scene);
        this.state = {};
        this.lastFrame = 0;
        this.gameloopRequestId = null;

        this.gameloop = this.gameloop.bind(this);
    }

    start() {
        super.start();
        this.state = {
            me: {
                percentsY: 8.7,
                percentsX: 50,
                direction: 'RIGHT',
                width: 10,
                height: 18,
                speed: 1.7,
            },
            score: 0,
        };


        this.state.products = [];
        this.state.productWidth = 5;
        this.state.productHeight = 5;
        this.state.startSpeed = 20;
        this.state.gravityAcceleration = 0.13;
        for (let i = 0; i < 10; i++) {
            this.state.products[i] = {
                type: randInt(1, 6),
                percentsX: randInt(5, 95), // считаем что тут задаем центр
                percentsY: 100 + i * 45 + randInt(-3, 3), // и тут
                collected: false,
                speed: this.state.startSpeed, // randInt(25, 40), // доли тысячные
                dead: false,
            };
        }
        console.log(this.state.products);

        this.gameTime = 30; // seconds
        this.state.leftTime = this.gameTime;
        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            console.log('FINISH!!!!');
            alert('Время вышло!');
            clearInterval(this.secsInervalID);
            bus.emit(EVENTS.FINISH_GAME, this.state.score);
        }, this.gameTime * 1000);
        this.secsInervalID = setInterval( () => {
            this.gameTime -= 1;
            this.state.leftTime = this.gameTime;
        }, 1000);
    }

    destroy() {
        console.log('DESTROOOOY!');
        clearTimeout(this.endTimerID);
        cancelAnimationFrame(this.gameloopRequestId);
        super.destroy();
    }

    gameloop(now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;


        for (let i = 0; i < this.state.products.length; i++) {
            const product = this.state.products[i];
            if (product.percentsY <= 110) {
                product.speed += this.state.gravityAcceleration * delay;
            }
            product.percentsY -= product.speed / 1000 * delay;
            if (this.macroCollision(product, this.state.me) ) {
                product.collected = true;
                product.speed = 0;
                product.percentsX = -100;
                product.percentsY = 50;
                if (product.type === 5) {
                    this.state.score -= 1;
                } else {
                    this.state.score += 3;
                }
                console.log('СОБРАЛ!!');
            }
            if (product.percentsY < -20) {
                console.log('продукт пропал');
                product.percentsY = 400;
                product.percentsX = randInt(5, 95);
                product.speed = this.state.startSpeed;
                product.type = randInt(1, 6);
            }
        }

        bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);

        let allCollected = true;
        this.state.products.forEach( product => {
            if (product.collected === false) allCollected = false;
        });
        if (allCollected) {
            alert('Вы собрали все продукты! Победа!');
            clearTimeout(this.endTimerID);
            bus.emit(EVENTS.FINISH_GAME, this.state.score);
            return;
        }
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    macroCollision(product, me) {
        const { productWidth, productHeight } = this.state;
        const { width: meWidth, height: meHeight } = this.state.me;

        // координаты левого верхнего угла продукта
        const productX = product.percentsX - productWidth / 2;
        const productY = product.percentsY - productHeight / 2;

        // координаты левого верхнего угла игрока
        const meX = me.percentsX - meWidth / 2;
        const meY = me.percentsY - meHeight / 2;


        let XColl = false;
        let YColl = false;

        if ( (productX + productWidth >= meX) && (productX <= meX + meWidth) ) XColl = true;
        if ( (productY + productHeight >= meY) && (productY <= meY + meHeight) ) YColl = true;

        if (XColl && YColl) {
            console.log(`Me: (${me.percentsX}, ${me.percentsY}); Product: (${product.percentsX}, ${product.percentsY})`);
        }

        return XColl && YColl;
    }

    onControlsPressed(event) {
        if ( this.pressed('LEFT', event) ) {
            this.state.me.percentsX = Math.max(0, this.state.me.percentsX - this.state.me.speed);
            this.state.me.direction = 'LEFT';
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
        } else if ( this.pressed('RIGHT', event) ) {
            this.state.me.percentsX = Math.min(100, this.state.me.percentsX + this.state.me.speed);
            this.state.me.direction = 'RIGHT';
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
        } else if ( this.pressed('JUMP', event) ) {
            console.log('player want to jump');
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
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
