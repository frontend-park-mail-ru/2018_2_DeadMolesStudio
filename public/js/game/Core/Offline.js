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
            },
            score: 0,
        };

        this.state.products = Array.from(new Array(3 * 5), (_, id) => {
            return {
                id: id,
                type: randInt(0, 5),
                percentsX: randInt(0, 100),
                percentsY: 100,
                collected: false,
            };
        });

        bus.emit(EVENTS.START_GAME, this.state);
    }

    gameloop(now) {
        const delay = now - this.lastFrame;
        this.lastFrame = now;

        this.state.products = this.state.products
            .map( (product) => {
                product.percents += 0.02 * (delay ** 2);
                return product.percents;
            })
            .filter( (product) => {
                if (product.percents >= 1 || product.collected === true) {
                    return false;
                }
                return product.percents < 1;
            });

        bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);

        if ( !this.state.products.find(product => !product.collected) ) {
            bus.emit(EVENTS.FINISH_GAME);
        }

        this.gameloopRequestId = requestAnimationFrame(this.gameloop);
    }

    onControlsPressed(event) {
        if ( this.pressed('LEFT', event) ) {
            console.log('LEFT');
            this.state.me.percentsX = Math.max(0, this.state.me.percentsX - 2);
            bus.emit(EVENTS.GAME_STATE_CHANGED, this.state);
        } else if ( this.pressed('RIGHT', event) ) {
            console.log('RIGHT');
            this.state.me.percentsX = Math.min(100, this.state.me.percentsX + 2);
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

    onGameFinished() {
        cancelAnimationFrame(this.gameloopRequestId);
        bus.emit('CLOSE GAME');
    }

    onGameStateChanged(event) {
        this.scene.setState(event);
    }
}
