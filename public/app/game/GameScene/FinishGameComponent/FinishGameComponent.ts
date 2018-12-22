import ButtonComponent from '../../../components/Button/Button'
import bus from '../../../modules/EventBus';
import EVENTS from '../../Core/Events';
import { exitFullscreen } from 'modules/fullscreenAPI/fullscreen.js';

export default class FinishGameComponent {

    el;
    text;
    score;
    block;

    constructor({ el = document.createElement('div') } = {}) {
        this.el = el;

        this.text = null;
        this.score = null;
        this.block = null;
        this.setInfo = this.setInfo.bind(this);
        bus.on('show-game-result', this.setInfo );
    }

    setInfo({ text, score }) {
        this.text = text;
        this.score = score;
        this.render();
    }

    destroy() {
        bus.off('show-game-result', this.setInfo );
        this.el.innerHTML = '';
        // this.render = () => null;
    }

    render() {
        console.log('render finish');
        this.block = document.createElement('div');
        this.block.className = 'game-scene__game-finish-component app-router-ignore';

        this.block.innerHTML += `<div class="game-finish-component__text-block"><p>${this.text}</p> <p>You scored ${this.score} points</p></div>`;

        const backButton = new ButtonComponent({
            el: this.block,
            text: 'Menu',
        });
        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                bus.emit(EVENTS.FINISH_GAME, this.score);
                exitFullscreen();
                this.destroy();
            },
        });
        backButton.render();


        const playAgain = new ButtonComponent({
            el: this.block,
            text: 'Play again',
            className: 'cute-btn cute-btn--w10rem app-router-ignore'
        });
        playAgain.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log(window.location);
                const url = ('' + window.location)
                    .replace('https://dmstudio.now.sh', '')
                    .replace('https://playketnipz.ru/', '');

                bus.emit(EVENTS.FINISH_GAME, this.score);
                exitFullscreen();
                this.destroy();
                if (url === '/multiplayer') {
                    bus.emit('play-again:multi');
                } else {
                    bus.emit('play-again:single');
                }
            },
        });
        playAgain.render();

        const scene = this.el.querySelector('.game-scene');
        scene.classList.add('game-scene--blurred');

        this.el.appendChild(this.block);
    }
}
