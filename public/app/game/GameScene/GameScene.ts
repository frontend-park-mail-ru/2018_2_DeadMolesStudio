import Scene from '../../modules/graphics/Scene';
import GamePlayerFigure from './Player';
import GameProductFigure from './Product';
import PRODUCTS from './ProductTypes';
import GameInfoComponent from './GameInfoComponent/GameInfoComponent';
import ImageFigure from './ImageFigure';
import bus from '../../modules/EventBus';
import User from '../../modules/User';
import GameTimerComponent from './GameTimerComponent/GameTimerComponent';
import backDomain from "../../projectSettings";


export default class GameScene {

    isMultiplayer;
    ctx;
    canvas;
    scene;

    requestFrameId;
    lastFrameTime;

    me;
    opponent;
    truck;
    playerInfo;
    gameTimer;
    opponentInfo;

    poolSize;
    productFiguresPool;
    productPoolNext;

    collectedFiguresPool;
    collectedPoolNext;
    collectedPoolUsing;

    state;
    playerName;
    opponentName;


    constructor(canvas, poolSize = 7) {
        this.isMultiplayer = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = new Scene(this.ctx);

        this.requestFrameId = null;
        this.lastFrameTime = 0;

        this.me = null;
        this.truck = null;
        this.poolSize = poolSize;
        this.opponentInfo = null;
        this.playerInfo = null;
        this.gameTimer = null;

        this.productFiguresPool = null;
        this.productPoolNext = null;

        this.collectedFiguresPool = null;
        this.collectedPoolNext = null;
        this.collectedPoolUsing = null;

        this.state = null;
        this.playerName = null;
        this.opponentName = null;
    }

    init(state) {
        const { ctx, scene } = this;
        this.state = state;

        if (this.state.opponentName) {
            this.opponentName = this.state.opponentName;
            this.isMultiplayer = true;
        }
        this.playerName = this.state.playerName;

        const { productWidth, productHeight } = state;
        const { width: meWidth, height: meHeight } = state[this.playerName];
        const pixWidth = meWidth / 100 * ctx.canvas.width;
        const pixHeight = meHeight / 100 * ctx.canvas.height;

        this.productFiguresPool = Array.from({ length: this.poolSize }, () => new GameProductFigure(ctx) );
        this.productFiguresPool.forEach( (product) => {
            product.textSize = this.state.productHeight / 100 * ctx.canvas.height;
            product.id = this.scene.push(product);
            product.x = -100;
            product.y = -100;
            product.type = PRODUCTS.HIDDEN_POOL;
        });
        this.productPoolNext = 0;

        this.collectedPoolUsing = [];
        this.collectedFiguresPool = Array.from({ length: this.poolSize }, () => new GameProductFigure(ctx) );
        this.collectedFiguresPool.forEach( (collected) => {
            collected.textSize = this.state.productHeight / 100 * ctx.canvas.height;
            collected.id = this.scene.push(collected);
            collected.x = -100;
            collected.y = -100;
            collected.type = PRODUCTS.HIDDEN_POOL;
            this.collectedPoolUsing.push(false);
        });
        this.collectedPoolNext = 0;


        this.me = new GamePlayerFigure(ctx, pixWidth, pixHeight);
        this.me.y = (100 - state[this.playerName].percentsY) / 100 * ctx.canvas.height;
        this.me.x = state[this.playerName].percentsX / 100 * ctx.canvas.width;
        this.me.direction = state[this.playerName].direction;
        if (this.isMultiplayer) {
            this.opponent = new GamePlayerFigure(ctx, pixWidth, pixHeight, true);
            this.opponent.y = (100 - state[this.opponentName].percentsY) / 100 * ctx.canvas.height;
            this.opponent.x = state[this.opponentName].percentsX / 100 * ctx.canvas.width;
            this.opponent.direction = state[this.opponentName].direction;
            this.opponent.id = this.scene.push(this.opponent);
        } else {
            this.me.name = '';
        }

        this.me.id = this.scene.push(this.me);

        this.state.products.forEach( (product) => {
            const idx = this.productPoolNext;
            if (idx >= this.productFiguresPool.length) {
                console.error('Pool of productFigures out of range');
                return;
            }
            this.productPoolNext += 1;
            this.productFiguresPool[idx].x = (product.percentsX - productWidth / 2) / 100 * ctx.canvas.width;
            this.productFiguresPool[idx].y = (100 - (product.percentsY - productHeight / 2) ) / 100 * ctx.canvas.height;
            this.productFiguresPool[idx].type = product.type;
        });

        if (this.state.truck) {
            this.truck = new ImageFigure(ctx, 'app/game/GameScene/img/telega.png');
            this.truck.x = state.truck.percentsX / 100 * ctx.canvas.width;
            this.truck.y = (100 - state.truck.percentsY) / 100 * ctx.canvas.height;
            this.truck.width = state.truck.width / 100 * ctx.canvas.width;
            this.truck.height = state.truck.height / 100 * ctx.canvas.height;
            this.truck.id = scene.push(this.truck);
        }

        this.renderScene = this.renderScene.bind(this);
    }

    setState(state) {
        const { ctx } = this;

        this.state = state;

        this.me.jumping = this.state[this.playerName].percentsY > 8.7;

        this.me.y = (100 - (state[this.playerName].percentsY) ) / 100 * ctx.canvas.height;
        this.me.x = state[this.playerName].percentsX / 100 * ctx.canvas.width;
        this.me.direction = this.state[this.playerName].direction;

        this.gameTimer.time = this.state.leftTime;
        this.gameTimer.render();

        if (this.isMultiplayer) {
            this.opponent.jumping = this.state[this.opponentName].percentsY > 8.7;

            this.opponent.y = (100 - (state[this.opponentName].percentsY) ) / 100 * ctx.canvas.height;
            this.opponent.x =  state[this.opponentName].percentsX / 100 * ctx.canvas.width;
            this.opponent.direction = this.state[this.opponentName].direction;
        }

        // TODO: тут подпихиваем обновленный список продуктов
        let playerProducts = '';
        this.state[this.playerName].targetList.forEach( (targetProduct) => {
            playerProducts += `${PRODUCTS[targetProduct]}`;
        });

        this.playerInfo.setInfo({
            score: this.state[this.playerName].score,
            productList: playerProducts,
        });
        this.playerInfo.render();

        if (this.isMultiplayer) {
            let opponentsProducts = '';
            this.state[this.opponentName].targetList.forEach( (targetProduct) => {
                opponentsProducts += `${PRODUCTS[targetProduct]}`;
            });
            this.opponentInfo.setInfo({
                score: this.state[this.opponentName].score,
                productList: opponentsProducts,
            });
            this.opponentInfo.render();
        }

        // выносим все элементы продуктов из пула за сцену
        this.productFiguresPool.forEach( (product) => {
            product.x = -100;
            product.y = -100;
            product.type = PRODUCTS.HIDDEN_POOL;
        });
        this.productPoolNext = 0;

        const { productWidth, productHeight } = this.state;

        // рисуем пришедшие из стейта данные о продуктах

        if (this.state.products) {
            this.state.products.forEach((product) => {
                const idx = this.productPoolNext;

                if (idx >= this.productFiguresPool.length) {
                    console.error('Pool of productFigures out of range');
                    return;
                }

                this.productPoolNext += 1;

                this.productFiguresPool[idx].x = (product.percentsX - productWidth / 2) / 100 * ctx.canvas.width;
                // TODO проверить некст строку, возможно должен быть минус | <- вот тут
                this.productFiguresPool[idx].y = (100 - (product.percentsY + productHeight / 2)) / 100 * ctx.canvas.height;
                this.productFiguresPool[idx].type = product.type;
            });
        }

        // о собранных продуктах
        if (this.state.collected) {
            this.state.collected.forEach((collected) => {
                const idx = this.collectedPoolNext;
                this.collectedPoolUsing[idx] = true;
                // console.log('idx:', idx, 'using:', this.collectedPoolUsing);
                this.collectedPoolNext = this.collectedPoolUsing.indexOf(false);

                if (idx >= this.collectedFiguresPool.length || idx < 0) {
                    console.error('Pool of collectedFigures out of range:', idx);
                    return;
                }

                this.collectedFiguresPool[idx].x = (collected.percentsX - productWidth / 2) / 100 * ctx.canvas.width;
                this.collectedFiguresPool[idx].y = (100 - (collected.percentsY + productHeight / 2)) / 100 * ctx.canvas.height;

                if (collected.playerNum === this.state.playerNum) {
                    if (collected.points > 0) {
                        this.collectedFiguresPool[idx].fillStyle = 'green';
                        window.navigator.vibrate(0);
                        window.navigator.vibrate(150);
                    } else {
                        this.collectedFiguresPool[idx].fillStyle = 'red';
                        window.navigator.vibrate(0);
                        window.navigator.vibrate(40);
                    }
                } else {
                    this.collectedFiguresPool[idx].fillStyle = 'gray';
                }

                this.collectedFiguresPool[idx].type = PRODUCTS.COLLECTED(collected.points);

                setTimeout( () => {
                    // console.log('in timeout:', this.collectedFiguresPool[idx]);
                    this.collectedFiguresPool[idx].x = -100;
                    this.collectedFiguresPool[idx].y = -100;
                    this.collectedFiguresPool[idx].type = PRODUCTS.HIDDEN_POOL;
                    this.collectedPoolUsing[idx] = false;
                }, 1 * 1000);
            });
        }
    }

    renderScene(now) {
        this.lastFrameTime = now;

        this.scene.render();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    start() {
        const gameSceneElement = document.querySelector('.game-scene');
        const playerTextSize = `${30 / 1000 * this.ctx.canvas.height}px`;
        const opponentTextSize = `${30 / 1000 * this.ctx.canvas.height}px`;

        this.gameTimer = new GameTimerComponent({ parentElem: gameSceneElement, textSize: playerTextSize, time: this.state.leftTime });

        this.playerInfo = new GameInfoComponent({ parentElem: gameSceneElement, textSize: playerTextSize, left: '4.5rem' });
        let productList = '';
        this.state[this.playerName].targetList.forEach( (targetProduct) => {
            productList += `${PRODUCTS[targetProduct]}`;
        });

        this.playerInfo.setInfo({
            score: this.state[this.playerName].score,
            productList: productList,
        });
        this.playerInfo.render();

        if (this.isMultiplayer) {
            this.opponentInfo = new GameInfoComponent({ parentElem: gameSceneElement, textSize: opponentTextSize, isOpponent: true, right: '2%' });
            let productList = '';
            this.state[this.opponentName].targetList.forEach( (targetProduct) => {
                productList += `${PRODUCTS[targetProduct]}`;
            });
            this.opponentInfo.setInfo({
                score: this.state[this.opponentName].score,
                productList: productList,
            });
            this.opponentInfo.render();

            bus.on('ws:opponent_received', (user) => {
                console.log('opponent', user);
                this.playerInfo.setInfo({
                    score: this.state[this.playerName].score,
                    productList: productList,
                    nickname: User.getNickname(),
                    avatar: backDomain + User.getUser().avatar,
                });
                this.playerInfo.render();
                this.opponentInfo.setInfo({
                    score: this.state[this.opponentName].score,
                    productList: productList,
                    nickname: user.nickname,
                    avatar: backDomain + user.avatar,
                });
                this.opponentInfo.render();

                const mySkin = User.getUser().current_skin;
                const opponentSkin = user.current_skin;

                this.me.setSkinType(mySkin);
                this.opponent.setSkinType(opponentSkin);
            });
        } else {
            const mySkin = User.getUser() ? User.getUser().current_skin : 0;
            this.me.setSkinType(mySkin);
        }

        this.lastFrameTime = performance.now();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    stop() {
        if (this.requestFrameId) {
            window.cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = null;
        }
        if (this.playerInfo) {
            this.playerInfo.destroy();
        }
        if (this.opponentInfo) {
            this.opponentInfo.destroy();
        }
        if (this.gameTimer) {
            this.gameTimer.destroy();
        }
        this.scene.clear();
    }
}
