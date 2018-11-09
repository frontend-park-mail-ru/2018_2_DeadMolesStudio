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
        this.score = new TextFigure(ctx);
        this.score.id = this.scene.push(this.score);
        this.score.text = `Очки: ${this.state.score}`;

        this.list = new TextFigure(ctx);
        this.list.id = this.scene.push(this.list);
        this.list.x = 320;
        this.list.text = `Список покупок: ${PRODUCTS[1]}${PRODUCTS[2]}${PRODUCTS[3]}${PRODUCTS[4]}${PRODUCTS[6]}`;

        this.me = new GamePlayerFigure(ctx);
        this.me.id = this.scene.push(this.me);
        this.products = this.state.products.map( product => {
            const p = new GameProductFigure(ctx);
            p.id = this.scene.push(p);
            p.x = product.percentsX / 100 * ctx.canvas.width;
            p.y = (100 - product.percentsY) / 100 * ctx.canvas.height;
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
        this.me.y = (100 - state.me.percentsY) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        this.me.direction = this.state.me.direction;
        this.score.text = `Очки: ${this.state.score}`;

        this.products.forEach( (product, pos) => {
            const updProduct = this.state.products[pos];
            if ( (updProduct.collected || updProduct.dead) && product.id) {
                scene.removeFigure(product.id);
                return;
            }
            product.type = updProduct.type;
            product.x = updProduct.percentsX / 100 * ctx.canvas.width;
            product.y = (100 - updProduct.percentsY) / 100 * ctx.canvas.height;
        });
    }

    renderScene(now) {
        const { ctx, scene } = this;
        const delay = now - this.lastFrameTime;
        this.lastFrameTime = now;

        this.products.forEach( (product, pos) => {
            const updProduct = this.state.products[pos];
            if (updProduct.collected && product.id) {
                scene.removeFigure(product.id);
            }
        });

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
