import bus from '../../modules/EventBus.js';
import Scene from '../../modules/graphics/Scene.js';
import GamePlayerFigure from './Player.js';
import Rect from "../../modules/graphics/Rect.js";
import GameProductFigure from "./Product.js";
import TextFigure from "./TextFigure.js";
import PRODUCTS from "./ProductTypes.js";

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
        const textSize = 4 / 100 * ctx.canvas.height;

        let startInfoPercents = 0.15;
        if (ctx.canvas.height < 500) {
            startInfoPercents = 0.20;
        }

        this.score = new TextFigure(ctx, textSize);
        this.score.fillStyle = 'black';
        this.score.text = `Очки: ${this.state.score}`;
        this.score.y = startInfoPercents * ctx.canvas.height;
        this.score.x = 15 / 1000 * ctx.canvas.width;

        this.score.id = this.scene.push(this.score);

        this.listText = new TextFigure(ctx, textSize);
        this.listText.fillStyle = 'black';
        startInfoPercents += 0.05;
        this.listText.y = startInfoPercents * ctx.canvas.height;
        this.listText.x = 15 / 1000 * ctx.canvas.width;
        this.listText.text = `Список покупок:`;

        this.listText.id = this.scene.push(this.listText);
        this.list = new TextFigure(ctx, textSize);
        this.list.fillStyle = 'black';
        startInfoPercents += 0.06;
        this.list.y = startInfoPercents * ctx.canvas.height;
        this.list.x = 15 / 1000 * ctx.canvas.width;
        this.list.text = `${PRODUCTS[1]}${PRODUCTS[2]}${PRODUCTS[3]}${PRODUCTS[4]}${PRODUCTS[6]}`;
        this.list.id = this.scene.push(this.list);
        this.timer = new TextFigure(ctx, textSize);

        this.timer.fillStyle = 'black';
        startInfoPercents += 0.05;
        this.timer.y = startInfoPercents * ctx.canvas.height;
        this.timer.x = 15 / 1000 * ctx.canvas.width;
        this.timer.text = `Время: ${this.state.leftTime}`;
        this.timer.id = this.scene.push(this.timer);

        const { productWigth, productHeight } = state;
        const { width: meWidth, height: meHeight } = state.me;
        const pixWidth = meWidth / 100 * ctx.canvas.width;
        const pixHeight = meHeight / 100 * ctx.canvas.height;
        this.me = new GamePlayerFigure(ctx, pixWidth, pixHeight);
        this.me.id = this.scene.push(this.me);
        this.products = this.state.products.map( product => {
            const p = new GameProductFigure(ctx);
            p.textSize = this.state.productHeight / 100 * ctx.canvas.height;
            p.id = this.scene.push(p);
            p.x = (product.percentsX - productWigth / 2) / 100 * ctx.canvas.width;
            p.y = (100 - (product.percentsY - productHeight / 2)) / 100 * ctx.canvas.height;
            p.type = product.type;
            return p;
        });

        this.me.y = (100 - state.me.percentsY) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        this.me.direction = state.me.direction;
        this.me.id = scene.push(this.me);
        this.renderScene = this.renderScene.bind(this);
    }

    setState(state) {
        const { ctx, scene } = this;

        this.state = state;
        this.me.y = (100 - (state.me.percentsY)) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        this.me.direction = this.state.me.direction;
        this.score.text = `Очки: ${this.state.score}`;

        // TODO: тут подпихиваем обновленный список продуктов
        // this.list.text = `${PRODUCTS[1]}${PRODUCTS[2]}${PRODUCTS[3]}${PRODUCTS[4]}${PRODUCTS[6]}`;

        this.timer.text = `Время: ${this.state.leftTime}`;

        this.products.forEach( (product, pos) => {
            const updProduct = this.state.products[pos];
            if ( (updProduct.collected || updProduct.dead) && product.id) {

                scene.removeFigure(product.id);
                return;
            }
            product.type = updProduct.type;
            const { productWidth, productHeight } = state;
            product.x = (updProduct.percentsX - productWidth / 2) / 100 * ctx.canvas.width;
            product.y = (100 - (updProduct.percentsY + productHeight / 2)) / 100 * ctx.canvas.height;
        });
    }

    renderScene(now) {
        const { ctx, scene } = this;
        // const delay = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // this.products.forEach( (product, pos) => {
        //     const updProduct = this.state.products[pos];
        //     if (updProduct.collected && product.id) {
        //         console.log('inrender');
        //         scene.removeFigure(product.id);
        //     }
        // });

        scene.render();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    start() {
        this.lastFrameTime = performance.now();
        this.requestFrameId = requestAnimationFrame(this.renderScene);
    }

    stop() {
        if (this.requestFrameId) {
            window.cancelAnimationFrame(this.requestFrameId);
            this.requestFrameId = null;
        }

        this.scene.clear();
    }
}
