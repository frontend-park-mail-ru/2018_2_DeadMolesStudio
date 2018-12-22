import BaseView2 from 'views/Base2';
import GAME_MODES from 'game/GameModes';
import Game from 'game/Game';
import bus from 'modules/EventBus';
import launchFullscreen, { exitFullscreen } from 'modules/fullscreenAPI/fullscreen.js';
import FinishGameComponent from 'game/GameScene/FinishGameComponent/FinishGameComponent';
import EVENTS from 'game/Core/Events';
import GameLoaderComponent from 'components/GameLoader/GameLoader';
import ErrorComponent from 'components/Error/Error';
import BackButtonComponent from "components/BackButton/BackButton";


export default class MultiPlayerView extends BaseView2 {

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
        const gameLoader = this._el.querySelector('.game-loader');
        gameLoader.innerHTML = '';
        const err = new ErrorComponent({
            el: gameLoader,
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

        const container = this._el.querySelector('.container');
        container.classList.add('container_no-scroll');


        const gameLoader = new GameLoaderComponent(container);
        gameLoader.render();

        const onGameStarted = () => {
            gameLoader.hide();
            bus.off('ws:started', onGameStarted);
            bus.off('ws:playing', this.onPlaying);
        };
        bus.on('ws:started', onGameStarted);
        bus.on('ws:playing', this.onPlaying);

        container.insertAdjacentHTML('beforeend', `
            <div class="game-scene">
                <div class="game-canvas__background"></div>
                <canvas class="js-canvas game-view__canvas game-canvas" width="600" height="400"></canvas>
            </div>
        `);
        const finishComponent = new FinishGameComponent({ el: container });

        const scene = this._el.querySelector('.game-scene');
        this.canvas = this._el.querySelector('.js-canvas');

        if (window.innerHeight > window.innerWidth) {
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
        const wrapBackButton = document.createElement('div');
        wrapBackButton.classList.add('game-scene__back-button-wrap');
        const backButton = new BackButtonComponent({ el: wrapBackButton });
        backButton.render();
        backButton.on({
            event: 'click',
            callback: (event) => {
                bus.emit('multiplayer:end');
                event.preventDefault();
                exitFullscreen();
                bus.emit(EVENTS.CLOSE_GAME);
            },
        });
        container.appendChild(wrapBackButton);
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
