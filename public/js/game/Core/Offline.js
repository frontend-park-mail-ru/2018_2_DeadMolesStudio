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
                speedY: 0,
            },
            truck: {
                percentsX: -30,
                percentsY: 6,
                width: 10,
                height: 15,
            },
            score: 0,
        };

        this.state.playerGravity = 0.4;
        this.state.products = [];
        this.state.targetList = [];
        for (let i = 0; i < 4; i++) {
            let newProduct = randInt(1, 6);
            while (this.state.targetList.indexOf(newProduct) !== -1) {
                newProduct = randInt(1, 6);
            }
            this.state.targetList.push(newProduct);
        }
        this.state.productWidth = 5;
        this.state.productHeight = 5;
        this.state.startSpeed = 30;
        this.state.gravityAcceleration = 0;
        this.state.productsIntervalPercents = 35;
        this.state.productsRand = 3;
        for (let i = 0; i < 10; i++) {
            const rand = randInt(-this.state.productsRand, this.state.productsRand);
            this.state.products[i] = {
                type: randInt(1, 6),
                percentsX: randInt(5, 95), // считаем что тут задаем центр
                percentsY: 130 + i * this.state.productsIntervalPercents + rand, // и тут
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
            clearInterval(this.secsInervalID);
            clearTimeout(this.endTimerID);
            cancelAnimationFrame(this.gameloopRequestId);
            this.stopController();
            bus.emit('show-game-result', { text: 'Время вышло :( Вы не успели все собрать :(', score: this.state.score });
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
                // Если собрали продукт
                product.collected = true;
                product.speed = 0;
                product.percentsX = -100;
                product.percentsY = 50;
                const productPosInTargetList = this.state.targetList.indexOf(product.type);
                const isTarget = productPosInTargetList !== -1;
                if (isTarget) {
                    this.state.score += 3;
                    bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
                    this.state.targetList.splice(productPosInTargetList, 1);
                } else {
                    this.state.score -= 1;
                }
            }
            if (product.percentsY < -20) {
                const maxProductsY = Math.max(...this.state.products.map(p => p.percentsY) );
                const rand = randInt(-this.state.productsRand, this.state.productsRand);
                product.percentsY = maxProductsY + this.state.productsIntervalPercents + rand;
                product.percentsX = randInt(5, 95);
                product.speed = this.state.startSpeed;
                product.type = randInt(1, 6);
            }
        }

        if (this.macroCollision(this.state.truck, this.state.me) ) {
            console.log(`уперся ${this.state.truck.percentsX > this.state.me.percentsX ? 'слева' : 'справа'}`);
            if (this.state.truck.percentsX > this.state.me.percentsX) {
                this.state.me.blockRight = true;
                this.state.me.blockLeft = false;
            } else {
                this.state.me.blockRight = false;
                this.state.me.blockLeft = true;
            }
        }



        if (this.macroCollision(this.state.truck, this.state.me) ) {
            if (this.state.me.speedY < 0 && (this.state.me.percentsX) < (this.state.truck.percentsX + this.state.truck.width/2) && (this.state.me.percentsX) > (this.state.truck.percentsX - this.state.truck.width/2)) {
                console.log('уперлись сверху');
                this.state.me.blockDown = true;
                clearInterval(this.jumpInterval);
                this.jumpInterval = null;
                this.state.me.percentsY = this.state.truck.height + 4;
                this.state.playerGravity = 0;
                this.state.me.speedY = 0;
            } else {
                this.state.me.percentsY = this.state.truck.height + 4;
                this.state.playerGravity = 0.4;
                this.state.me.speedY = 0;
            }
        } else {
            console.log('нет столкновения');
            if (!this.jumpInterval) {
                console.log('и интервала тоже нет');
                this.state.me.percentsY = 8.7;
                this.state.playerGravity = 0.4;
                this.state.me.speedY = 0;
            }
        }

        if (this.state.me.blockDown === true) {
            this.state.me.percentsY = this.state.truck.height + 4;
        }


        bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);

        const allCollected = this.state.targetList.length === 0;
        // this.state.products.forEach( product => {
        //     if (product.collected === false) allCollected = false;
        // });
        if (allCollected) {
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
            bus.emit('show-game-result', { text: 'Вы собрали все из списка покупок! Победа!', score: this.state.score });
            clearInterval(this.secsInervalID);
            clearTimeout(this.endTimerID);
            this.stopController();
            return;
        }
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    macroCollision(product, me) {
        const { productWidth, productHeight } = this.state;
        const { width: meWidth, height: meHeight } = this.state.me;

        // координаты левого верхнего угла продукта
        const productX = product.percentsX - (productWidth - 1) / 2;
        const productY = product.percentsY - (productHeight - 8) / 2;

        // координаты левого верхнего угла игрока
        const meX = me.percentsX - (meWidth - 2) / 2;
        const meY = me.percentsY - (meHeight - 15) / 2;


        let XColl = false;
        let YColl = false;

        if ( (productX + productWidth - 0.5 >= meX) && (productX <= meX + meWidth - 1) ) XColl = true;
        if ( (productY + productHeight - 4 >= meY) && (productY <= meY + meHeight - 7.5) ) YColl = true;

        if (XColl && YColl) {
            console.log(`Me: (${me.percentsX}, ${me.percentsY}); Product: (${product.percentsX}, ${product.percentsY})`);
        }

        return XColl && YColl;
    }

    onControlsPressed(event) {
        if ( this.pressed('LEFT', event) ) {
            if (!this.state.me.blockLeft) {
                this.state.me.percentsX = Math.max(0, this.state.me.percentsX - this.state.me.speed);
                this.state.me.direction = 'LEFT';
            }
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
            this.state.me.blockRight = false;

        }
        if ( this.pressed('RIGHT', event) ) {
            if (!this.state.me.blockRight) {
                this.state.me.percentsX = Math.min(100, this.state.me.percentsX + this.state.me.speed);
                this.state.me.direction = 'RIGHT';
            }
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
            this.state.me.blockLeft = false;
        }
        if ( this.pressed('JUMP', event) ) {
            this.state.me.blockRight = false;
            this.state.me.blockLeft = false;
            if (this.state.me.speedY === 0) {
                this.state.me.speedY = 4;
                this.state.playerGravity = 0.4; // уберите, чтобы получить телегу-батут
                this.jumpInterval = setInterval( () => {
                    this.state.me.percentsY += this.state.me.speedY;
                    this.state.me.speedY -= this.state.playerGravity;
                    if (this.state.me.percentsY <= 8.7) {
                        this.state.me.speedY = 0;
                        this.state.me.percentsY = 8.7;
                        clearInterval(this.jumpInterval);
                        this.jumpInterval = null;
                    }
                }, 20);
            }

            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
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
