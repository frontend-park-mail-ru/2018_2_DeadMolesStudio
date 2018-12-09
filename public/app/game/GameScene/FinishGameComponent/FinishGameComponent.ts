import ButtonComponent from '../../../components/Button/Button'
import bus from '../../../modules/EventBus';
import EVENTS from '../../Core/Events';

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

        bus.on('show-game-result', this.setInfo.bind(this) );
    }

    setInfo({ text, score }) {
        this.text = text;
        this.score = score;
        this.render();
    }

    destroy() {
        bus.off('show-game-result', this.setInfo );
        this.el.innerHTML = '';
        this.render = () => null;
    }

    render() {
        console.log('render finish');
        this.block = document.createElement('div');
        this.block.className = 'game-scene__game-finish-component app-router-ignore';

        this.block.innerHTML += `<div class="game-finish-component__text-block"><p>${this.text}</p> <p>Вы набрали: ${this.score} очков</p></div>`;

        const backButton = new ButtonComponent({
            el: this.block,
            text: 'Меню',
        });
        backButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                this.destroy();
                bus.emit(EVENTS.FINISH_GAME, this.score);
            },
        });
        backButton.render();

        const scene = this.el.querySelector('.game-scene');
        scene.classList.add('game-scene--blurred');

        this.el.appendChild(this.block);
    }
}
