import bus from '../../modules/EventBus.js';
import Scene from '../../modules/graphics/Scene.js';
import GamePlayerFigure from './Player.js';
import Rect from "../../modules/graphics/Rect.js";

export default class GameScene {
    constructor(canvas) {
        this.bus = bus;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scene = new Scene(this.ctx);

        this.state = null;
        this.requestFrameID = null;
        this.lastFrameTime = 0;

        this.field = [];
        this.me = null;
    }

    init(state) {
        const { ctx, scene } = this;
        this.state = state;

        // TODO инициализация продуктов

        this.me = new GamePlayerFigure(ctx);

        this.me.y = (100 - state.me.percentsY) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;
        console.log('state.me.percentsX', state.me.percentsX, 'ctx.canvas.width', ctx.canvas.width);
        this.me.id = scene.push(this.me);
        this.renderScene = this.renderScene.bind(this);
    }

    setState(state) {
        const { ctx, scene } = this;

        this.state = state;
        // this.me = state.me;
        this.me.y = (100 - state.me.percentsY) / 100 * ctx.canvas.height;
        this.me.x = state.me.percentsX / 100 * ctx.canvas.width;

        // TODO обновление продуктов
    }

    renderScene(now) {
        const { ctx, scene } = this;
        const delay = now - this.lastFrameTime;
        this.lastFrameTime = now;

        // TODO рендер продуктов

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
