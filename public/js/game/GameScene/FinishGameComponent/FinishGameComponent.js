import ButtonComponent from '../../../components/Button/Button.mjs';
import bus from '../../../modules/EventBus.js';
import {exitFullscreen} from "../../../modules/fullscreenAPI/fullscreen.js";

export default class FinishGameComponent {
    constructor({ el } = {}) {
        this.el = el;

        this.text = null;
        this.score = null;

        bus.on('show-game-result', this.setInfo.bind(this) );
        this.rendered = false;
    }

    setInfo({text, score}) {
        this.text = text;
        this.score = score;
        this.render();
    }

    destroy() {
        this.el.innerHTML = '';
    }

    render() {
        this.rendered = true;
        console.log('render finish');
        this.block = document.createElement('div');
        this.block.className = 'game-scene__game-finish-component js-router-ignore';

        this.block.innerHTML += `<p>${this.text}</p> <p>Вы набрали: ${this.score} очков</p>`;

        const backButton = new ButtonComponent({
            el: this.block,
            text: 'Меню',
        });
        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                console.log('ФИНИШКОМПОНЕНТ');
                this.destroy()
                bus.emit('CLOSE GAME');
                exitFullscreen();
                bus.emit('showmenu');
            },
        });
        backButton.render();

        this.el.appendChild(this.block);
    }
}
