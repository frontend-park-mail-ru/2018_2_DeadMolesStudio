import BaseView from './Base.js';
import ButtonComponent from '../components/Button/Button.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import GAME_MODES from '../game/GameModes.js';
import Game from '../game/Game.js';
import EVENTS from "../game/Core/Events.js";
import bus from "../modules/EventBus.js";

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

        const gameSection = new SectionComponent({ el: content, name: 'game' });
        gameSection.render();
        gameSection.sectionContent.insertAdjacentHTML('beforeend', `
            <canvas class="js-canvas game-view__canvas" width="600" height="400"></canvas>
        `);
        this.canvas = this._el.querySelector('.js-canvas');
        this.createGame();
        const backButton = new ButtonComponent({ el: gameSection.sectionContent, className: 'cute-btn cute-btn--w10rem js-router-ignore' });
        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('destroyCALLBACK');
                this.destroy();
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
