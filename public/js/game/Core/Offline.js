import GameCore from './GameCore.js';
import EVENTS from './Events.js';
import bus from '../../modules/EventBus.js';
import { randInt } from '../../modules/Utils.mjs';

// percentsX считаю в процентах слева направо
// percentsY считаю в процентах снизу вверх
export default class OfflineGame extends GameCore {
    constructor(controller, scene) {
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
                percentsY: 0,
                percentsX: 50,
                direction: 'RIGHT',
            },
            score: 0,
        };


        this.state.products = [];
        for (let i = 0; i < 10; i++) {
            this.state.products[i] = {
                type: randInt(1, 6),
                percentsX: randInt(5, 95),
                percentsY: 100 + randInt(0, 500),
                collected: false,
                speed: randInt(25, 40), // доли тысячные
                dead: false,
            };
        }
        console.log(this.state.products);

        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            console.log('FINISH!!!!');
            alert('Время вышло!');
            bus.emit(EVENTS.FINISH_GAME, this.state.score);
        }, 40 * 1000);
    }

    gameloop(now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;


        for (let i = 0; i < this.state.products.length; i++) {
            const product = this.state.products[i];
            product.percentsY -= product.speed / 1000 * delay;
            if ( this.macroCollision(product, this.state.me) ) {
                product.collected = true;
                product.speed = 0;
                product.percentsX = -100;
                product.percentsY = 50;
                if (product.type === 5) {
                    // alert(`Собирайте только продукты из списка покупок! Да и вообще, котиков есть нельзя!\uD83D\uDE38`);
                    this.state.score -= 1;
                } else {
                    this.state.score += 3;
                }
                console.log('СОБРАЛ!!');
            }
            if (product.percentsY < -20) {
                console.log('продукт пропал');
                product.percentsY = 500;
                product.percentsX = randInt(5, 95);
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
        const productWidth = 5;
        const productHeight = 7.5;
        const meWidth = 18.5;
        const meHeight = 23.5;

        const productX = product.percentsX - productWidth / 2;
        const productY = product.percentsY - productHeight / 2;

        const meX = me.percentsX - meWidth / 2;
        const meY = me.percentsY - meHeight / 2;

        let XColl = false;
        let YColl = false;

        if ( (productX + productWidth >= meX) && (productX <= meX + meWidth) ) XColl = true;
        if ( (productY + productHeight >= meY) && (productY <= meY + meHeight) ) YColl = true;

        return XColl && YColl;
    }

    onControlsPressed(event) {
        if ( this.pressed('LEFT', event) ) {
            this.state.me.percentsX = Math.max(0, this.state.me.percentsX - 1.65);
            this.state.me.direction = 'LEFT';
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
        } else if ( this.pressed('RIGHT', event) ) {
            this.state.me.percentsX = Math.min(100, this.state.me.percentsX + 1.65);
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
        cancelAnimationFrame(this.gameloopRequestId);
        bus.emit('CLOSE GAME', scores);
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
