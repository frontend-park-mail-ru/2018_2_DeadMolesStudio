import BaseView from './Base';
import ButtonComponent from '../components/Button/Button';
import SectionComponent from '../components/Section/Section';
import GAME_MODES from '../game/GameModes';
import Game from '../game/Game';
import bus from '../modules/EventBus';
import launchFullscreen, { exitFullscreen } from '../modules/fullscreenAPI/fullscreen.js';
import FinishGameComponent from '../game/GameScene/FinishGameComponent/FinishGameComponent';
import EVENTS from '../game/Core/Events';
import GameLoaderComponent from '../components/GameLoader/GameLoader';
import ErrorComponent from '../components/Error/Error';

export default class MultiPlayerView extends BaseView {

    canvas;
    game;
    gameSection;

    constructor(el) {
        super(el);
        this.canvas = null;
        this.game = null;
        this.gameSection = null;

        this.onClose = this.onClose.bind(this);
        this.onPlaying = this.onPlaying.bind(this);
        bus.on(EVENTS.CLOSE_GAME, this.onClose);
    }

    onClose(scores) {
        this.destroy();
        bus.emit('showmenu');
    }

    onPlaying() {
        const err = new ErrorComponent({
            el: this.gameSection.sectionContent,
            path: '/',
            error: 'You are already in the game with this account.\nYou can play in single player mode.',
            callback: () => {
                exitFullscreen();
                bus.emit(EVENTS.CLOSE_GAME);
            },
        });
        err.render();
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

        this.gameSection = new SectionComponent({ el: content, name: 'game' });
        this.gameSection.render();

        const gameLoader = new GameLoaderComponent(this.gameSection.sectionContent);
        gameLoader.render();

        const onGameStarted = () => {
            gameLoader.hide();
            bus.off('ws:started', onGameStarted);
            bus.off('ws:playing', this.onPlaying);
        };
        bus.on('ws:started', onGameStarted);
        bus.on('ws:playing', this.onPlaying);

        this.gameSection.sectionContent.insertAdjacentHTML('beforeend', `
            <div class="game-scene">
                <div class="game-canvas__background"></div>
                <canvas class="js-canvas game-view__canvas game-canvas" width="600" height="400"></canvas>
            </div>
        `);
        const finishComponent = new FinishGameComponent({ el: this.gameSection.sectionContent });

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
                exitFullscreen();
                bus.emit(EVENTS.CLOSE_GAME);
            },
        });
        backButton.render();
    }

    createGame() {
        const mode = GAME_MODES.ONLINE_MULTI;
        this.game = new Game(mode, this.canvas);
    }

    destroy() {
        this.game.destroy();
        this.game = null;
    }
}
