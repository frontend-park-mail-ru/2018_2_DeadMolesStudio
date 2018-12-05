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
        this.productGenIntrvalID = null;
        this.gameloop = this.gameloop.bind(this);
    }

    start() {
        super.start();
        let truckPos = randInt(20, 80);
        while (truckPos < 60 && truckPos > 40) {
            truckPos = randInt(20, 80);
        }
        this.state = {
            me: {
                percentsY: 8.7,
                percentsX: 50,
                direction: 'RIGHT',
                width: 10,
                height: 18,
                speed: 1.7,
                speedY: 0,
                score: 0,
            },
            truck: {
                percentsX: truckPos,
                percentsY: 6,
                width: 10,
                height: 15,
            },
            collected: [],
        };

        this.state.playerGravity = 0.4;
        this.state.products = [];

        this.genTargetList(4);

        this.state.productWidth = 5;
        this.state.productHeight = 5;
        this.state.startSpeed = 30;
        this.state.gravityAcceleration = 0;
        this.state.productsIntervalPercents = 35;
        this.state.productsRand = 3;

        this.productGenIntrvalID = setInterval( () => {
            console.log('продукт создан');
            this.state.products.push({
                type: randInt(1, 6),
                percentsX: randInt(5, 95), // считаем что тут задаем центр
                percentsY: 100 + randInt(1, 5),
                speed: this.state.startSpeed, // randInt(25, 40), // доли тысячные
            });
        }, 1 * 1000);

        this.gameTime = 30; // seconds
        this.state.leftTime = this.gameTime;
        bus.emit(EVENTS.START_GAME, this.state);

        this.endTimerID = setTimeout( () => {
            console.log('FINISH!!!!');
            clearInterval(this.secsInervalID);
            clearTimeout(this.endTimerID);
            cancelAnimationFrame(this.gameloopRequestId);
            this.stopController();
            bus.emit('show-game-result', { text: 'Финиш!', score: this.state.me.score });
        }, this.gameTime * 1000);
        this.secsInervalID = setInterval( () => {
            this.gameTime -= 1;
            this.state.leftTime = this.gameTime;
        }, 1000);
    }

    destroy() {
        console.log('DESTROOOOY!');
        clearTimeout(this.endTimerID);
        clearInterval(this.productGenIntrvalID);
        cancelAnimationFrame(this.gameloopRequestId);
        super.destroy();
    }

    gameloop(now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;
        this.state.collected = [];

        for (let i = 0; i < this.state.products.length; i++) {
            const product = this.state.products[i];
            if (product.percentsY <= 110) {
                product.speed += this.state.gravityAcceleration * delay;
            }

            product.percentsY -= product.speed / 1000 * delay;
            if (this.macroCollision(product, this.state.me) ) {
                // Если собрали продукт
                const productPosInTargetList = this.state.me.targetList.indexOf(product.type);
                const isTarget = productPosInTargetList !== -1;
                let points = 0;
                if (isTarget) {
                    points = 3;
                    this.state.me.targetList.splice(productPosInTargetList, 1);
                } else {
                    points = -1;
                }
                this.state.me.score += points;
                this.state.collected.push({
                    percentsX: product.percentsX,
                    percentsY: product.percentsY,
                    points: points,
                });
                this.state.products.splice(i, 1);
            }
            if (product.percentsY < -20) {
                // пропал продукт
                this.state.products.splice(i, 1);
            }
        }

        if (this.macroCollision(this.state.truck, this.state.me) ) {
            if (this.state.truck.percentsX > this.state.me.percentsX) {
                this.state.me.blockRight = true;
                this.state.me.blockLeft = false;
            } else {
                this.state.me.blockRight = false;
                this.state.me.blockLeft = true;
            }
        }

        if (!this.state.me.blockDown && this.macroCollision(this.state.truck, this.state.me) && (this.state.me.percentsY > 8.7) ) {
            if (this.state.me.speedY < 0
                && (this.state.me.percentsX) < (this.state.truck.percentsX + this.state.truck.width / 2)
                && (this.state.me.percentsX) > (this.state.truck.percentsX - this.state.truck.width / 2) ) {
                this.state.me.blockDown = true;
                this.state.me.speedY = -0.4;
                this.state.me.percentsY = this.state.truck.height + 4;
            } else {
                this.state.me.blockDown = false;
                this.state.me.percentsY = 8.7;
            }
        }

        if (this.state.me.blockDown
            && !( (this.state.me.percentsX) < (this.state.truck.percentsX + this.state.truck.width / 2)
                 && (this.state.me.percentsX) > (this.state.truck.percentsX - this.state.truck.width / 2) ) ) {
            this.state.me.blockDown = false;
            this.state.me.percentsY = 8.7;
            this.state.me.speedY = 0;
        }


        bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);

        const allCollected = this.state.me.targetList.length === 0;

        if (allCollected) {
            this.genTargetList(4);
        }
        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    genTargetList(len = 4) {
        this.state.me.targetList = [];
        for (let i = 0; i < len; i++) {
            let newProduct = randInt(1, 6);
            while (this.state.me.targetList.indexOf(newProduct) !== -1) {
                newProduct = randInt(1, 6);
            }
            this.state.me.targetList.push(newProduct);
        }
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

        return XColl && YColl;
    }

    onControlsPressed(event) {
        if (this.pressed('LEFT', event) ) {
            if (!this.state.me.blockLeft) {
                this.state.me.percentsX = Math.max(0, this.state.me.percentsX - this.state.me.speed);
                this.state.me.direction = 'LEFT';
            }
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
            this.state.me.blockRight = false;
        }
        if (this.pressed('RIGHT', event) ) {
            if (!this.state.me.blockRight) {
                this.state.me.percentsX = Math.min(100, this.state.me.percentsX + this.state.me.speed);
                this.state.me.direction = 'RIGHT';
            }
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
            this.state.me.blockLeft = false;
        }
        if (this.pressed('JUMP', event) ) {
            this.state.me.blockRight = false;
            this.state.me.blockLeft = false;
            this.state.me.blockDown = false;
            if (this.state.me.speedY === 0) {
                this.state.me.speedY = 4;
                this.jumpInterval = setInterval( () => {
                    if (this.state.me.blockDown === false) {
                        this.state.me.percentsY += this.state.me.speedY;
                        this.state.me.speedY -= this.state.playerGravity;
                    } else {
                        this.state.me.blockRight = false;
                        this.state.me.blockLeft = false;
                        this.state.me.speedY = 0;
                        this.state.me.percentsY = this.state.truck.height + 4;
                        clearInterval(this.jumpInterval);
                        this.jumpInterval = null;
                        return;
                    }
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
