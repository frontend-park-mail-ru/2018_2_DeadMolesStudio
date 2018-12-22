import BaseView2 from 'views/Base2';
import GAME_MODES from 'game/GameModes';
import Game from 'game/Game';
import bus from 'modules/EventBus';
import launchFullscreen, { exitFullscreen } from 'modules/fullscreenAPI/fullscreen.js';
import FinishGameComponent from 'game/GameScene/FinishGameComponent/FinishGameComponent';
import EVENTS from 'game/Core/Events';
import BackButtonComponent from "components/BackButton/BackButton";

export default class GameView extends BaseView2 {

    canvas;
    game;

    constructor(el) {
        super(el);
        this.canvas = null;
        bus.on(EVENTS.CLOSE_GAME, (scores) => {
            this.destroy();
            bus.emit('showmenu');
        });
    }

    show() {
        this._el.hidden = false;
        this.render();
    }

    render() {
        super.render();
        const container = this._el.querySelector('.container');
        container.classList.add('container_no-scroll');

        // const gameSection = new SectionComponent({ el: container, name: 'game' });
        // gameSection.render();
        // gameSection.sectionContent
        container.insertAdjacentHTML('beforeend', `
            <div class="game-scene">
                <div class="game-canvas__background"></div>
                <canvas class="js-canvas game-view__canvas game-canvas" width="600" height="400"></canvas>
            </div>
        `);

        const finishComponent = new FinishGameComponent({ el: container });

        const scene = this._el.querySelector('.game-scene');
        this.canvas = this._el.querySelector('.js-canvas');

        // const mql = window.matchMedia('orientation: portrait');
        if (window.innerHeight > window.innerWidth) {
            // Портретная ориентация
            this.canvas.width = window.innerHeight;
            this.canvas.height = window.innerWidth;
        } else {
            // Горизонтальная ориентация
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        this.createGame();

        const wrapBackButton = document.createElement('div');
        wrapBackButton.classList.add('game-scene__back-button-wrap');
        const backButton = new BackButtonComponent({ el: wrapBackButton,});
        backButton.render();

        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                this.destroy();
                exitFullscreen();
                bus.emit('showmenu');
                container.classList.remove('container_no-scroll');
            },
        });
        scene.appendChild(wrapBackButton);
    }

    createGame() {
        const mode = GAME_MODES.OFFLINE;
        this.game = new Game(mode, this.canvas);
        this.game.start();
    }

    destroy() {
        this.game.destroy();
    }
}
