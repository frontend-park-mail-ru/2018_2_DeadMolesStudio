import BaseView from './Base.js';
import ButtonComponent from '../components/Button/Button.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import GAME_MODES from '../game/GameModes.js';
import Game from '../game/Game.js';

export default class GameView extends BaseView {
    constructor(el) {
        super(el);
        this.canvas = null;
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
        const backButton = new ButtonComponent({ el: gameSection.sectionContent });
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
