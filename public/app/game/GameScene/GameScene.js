import bus from '../../modules/EventBus.js';
import Scene from '../../modules/graphics/Scene.js';
import GamePlayerFigure from './Player.js';
import GameProductFigure from './Product.js';
import PRODUCTS from './ProductTypes.js';
import GameInfoComponent from './GameInfoComponent/GameInfoComponent.js';
import ImageFigure from './ImageFigure.js';

export default class GameScene {
    constructor(canvas) {
        this.bus = bus;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = new Scene(this.ctx);

        this.state = null;
        this.requestFrameID = null;
        this.lastFrameTime = 0;

        this.products = [];
        this.me = null;
    }

    init(state) {
        const { ctx, scene } = this;

        this.state = state;

        const { productWigth, productHeight } = state;
        const { width: meWidth, height: meHeight } = state.me;
        const pixWidth = meWidth / 100 * ctx.canvas.width;
        const pixHeight = meHeight / 100 * ctx.canvas.height;

        this.me = new GamePlayerFigure(ctx, pixWidth, pixHeight);
        this.me.id = this.scene.push(this.me);
        this.products = this.state.products.map( (product) => {
            const p = new GameProductFigure(ctx);
            p.textSize = this.state.productHeight / 100 * ctx.canvas.height;
            p.id = this.scene.push(p);
            p.x = (product.percentsX - productWigth / 2) / 100 * ctx.canvas.width;
            p.y = (100 - (product.percentsY - productHeight / 2) ) / 100 * ctx.canvas.height;
            p.type = product.type;
            return p;
        });

        if (this.state.truck) {
            this.truck = new ImageFigure(ctx, 'app/game/GameScene/img/telega.png');
            this.truck.x = state.truck.percentsX / 100 * ctx.canvas.width;
            this.truck.y = (100 - state.truck.percentsY) / 100 * ctx.canvas.height;
            this.truck.width = state.truck.width / 100 * ctx.canvas.width;
            this.truck.height = state.truck.height / 100 * ctx.canvas.height;
            this.truck.id = scene.push(this.truck);
        }

        this.me.y = (100 - state.me.percentsY) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        this.me.direction = state.me.direction;
        this.me.id = scene.push(this.me);
        this.renderScene = this.renderScene.bind(this);
    }

    setState(state) {
        const { ctx, scene } = this;

        this.state = state;

        this.me.jumping = this.state.me.percentsY > 8.7;

        this.me.y = (100 - (state.me.percentsY) ) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        this.me.direction = this.state.me.direction;

        // TODO: тут подпихиваем обновленный список продуктов
        let productList = '';
        this.state.targetList.forEach( (targetProduct) => {
            productList += `${PRODUCTS[targetProduct]}`;
        });

        this.gameInfo.setInfo({
            score: this.state.score,
            time: this.state.leftTime,
            productList: productList,
        });
        this.gameInfo.render();

        this.products.forEach( (product, pos) => {
            const updProduct = this.state.products[pos];
            if ( (updProduct.collected || updProduct.dead) && product.id) {
                if (product.type === 'EATEN_CORRECT') return;
                const isTarget = this.state.targetList.indexOf(product.type) !== -1;
                product.type = isTarget ? 'EATEN_CORRECT' : 'EATEN_WRONG';
                setTimeout( () => {
                    scene.removeFigure(product.id);
                    product.id = null;
                }, 1 * 1000);
                return;
            }
            product.type = updProduct.type;
            const { productWidth, productHeight } = state;
            product.x = (updProduct.percentsX - productWidth / 2) / 100 * ctx.canvas.width;
            product.y = (100 - (updProduct.percentsY + productHeight / 2) ) / 100 * ctx.canvas.height;
        });
    }

    renderScene(now) {
        const { ctx, scene } = this;
        this.lastFrameTime = now;

        scene.render();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    start() {
        const gameSceneElement = document.querySelector('.game-scene');
        const textSize = `${4 / 100 * this.ctx.canvas.height}px`;

        this.gameInfo = new GameInfoComponent({ parentElem: gameSceneElement, textSize: textSize });
        let productList = '';
        this.state.targetList.forEach( (targetProduct) => {
            productList += `${PRODUCTS[targetProduct]}`;
        });
        this.gameInfo.setInfo({
            score: this.state.score,
            time: this.state.leftTime,
            productList: productList,
        });
        this.gameInfo.render();
        this.lastFrameTime = performance.now();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    stop() {
        if (this.requestFrameId) {
            window.cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = null;
        }
        this.gameInfo.destroy();
        this.scene.clear();
    }
}
