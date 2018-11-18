import BaseView from './Base.js';
import ButtonComponent from '../components/Button/Button.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import GAME_MODES from '../game/GameModes.js';
import Game from '../game/Game.js';
import bus from '../modules/EventBus.js';
import launchFullscreen, {exitFullscreen} from '../modules/fullscreenAPI/fullscreen.js';

export default class GameView extends BaseView {
    constructor(el) {
        super(el);
        this.canvas = null;

        bus.on('CLOSE GAME', (scores) => {
            this.destroy();
            alert(`Игра окончена. Вы набрали ${scores} очков!`);
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
        const scene = this._el.querySelector('.game-scene');
        this.canvas = this._el.querySelector('.js-canvas');
        console.log(`Scene: (${window.innerWidth}, ${window.innerHeight}) Canvas: (${this.canvas.width}, ${this.canvas.height}) `);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const documentEl = document.documentElement;
        launchFullscreen(documentEl);
        if (scene.requestFullscreen) {
            console.log('1')
            scene.requestFullscreen().finally(() => console.log('1'));
        } else if (scene.webkitrequestFullscreen) {
            console.log('1')
            scene.webkitRequestFullscreen().finally(() => console.log('2'));
        } else if (scene.mozRequestFullscreen) {
            console.log('1')
            scene.mozRequestFullScreen().finally(() => console.log('3'));

        }
        this.createGame();
        const backButton = new ButtonComponent({ el: scene, className: 'cute-btn cute-btn--w10rem js-router-ignore game-scene__back-button' });
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
