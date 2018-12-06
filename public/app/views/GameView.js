import BaseView from './Base.js';
import ButtonComponent from '../components/Button/Button.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import GAME_MODES from '../game/GameModes.ts';
import Game from '../game/Game.ts';
import bus from '../modules/EventBus.js';
import launchFullscreen, { exitFullscreen } from '../modules/fullscreenAPI/fullscreen.js';
import FinishGameComponent from '../game/GameScene/FinishGameComponent/FinishGameComponent.js';

export default class GameView extends BaseView {
    constructor(el) {
        super(el);
        this.canvas = null;

        bus.on('CLOSE GAME', (scores) => {
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
        const content = this._el.querySelector('.content');
        const title = this._el.querySelector('.game_title');
        content.removeChild(title);

        const gameSection = new SectionComponent({ el: content, name: 'game' });
        gameSection.render();
        gameSection.sectionContent.insertAdjacentHTML('beforeend', `
            <div class="game-scene">
                <div class="game-canvas__background"></div>
                <canvas class="js-canvas game-view__canvas game-canvas" width="600" height="400"></canvas>
            </div>
        `);

        const finishComponent = new FinishGameComponent({ el: gameSection.sectionContent });

        const scene = this._el.querySelector('.game-scene');
        this.canvas = this._el.querySelector('.js-canvas');
        // console.log(`Scene: (${window.innerWidth}, ${window.innerHeight}) Canvas: (${this.canvas.width}, ${this.canvas.height}) `);

        const mql = window.matchMedia('only screen and (orientation: portrait)');
        if (mql.matches) {
            // Портретная ориентация
            console.log('port');
            this.canvas.width = window.innerHeight;
            this.canvas.height = window.innerWidth;
        } else {
            // Горизонтальная ориентация
            console.log('goriz');
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        const documentEl = document.documentElement;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            // Take the user to a different screen here.
            launchFullscreen(documentEl);
        }
        this.createGame();
        const backButton = new ButtonComponent({ el: scene, className: 'cute-btn app-router-ignore game-scene__back-button' });
        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('destroyCALLBACK');
                this.destroy();
                exitFullscreen();
                bus.emit('showmenu');
            },
        });
        backButton.render();
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
