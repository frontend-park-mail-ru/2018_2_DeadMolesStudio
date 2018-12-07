import BaseView from './Base.ts';
import SectionComponent from "../components/Section/Section.ts";
import ButtonComponent from "../components/Button/Button.ts";
import bus from "../modules/EventBus.js";
import {exitFullscreen} from "../modules/fullscreenAPI/fullscreen.js";

export default class PreGameView extends BaseView{
    render() {
        super.render();
        const content = this._el.querySelector('.content');
        const section = new SectionComponent({ el: content, name: 'pregame' });
        section.render();
        const title = this._el.querySelector('.game_title');
        content.removeChild(title);
        section.sectionContent.insertAdjacentHTML('beforeend', `
            <div class="pre-game">
                <div class="pre-game__rules">
                     <h1>Обучение</h1>
                    В игре есть список покупок.<br>
                    Вам надо ловить продукты из списка покупок, <br>
                    передвигая героя при помощи клавиш-стрелок или при помощи наклонов смартфона.<br>
                    Прыжок: пробел или касание экрана.<br>
                    За продукты из списка вы получите <b>+3</b> очка.<br>
                    За ловлю других штраф <b>-1</b> очко.<br>
                    Время ограничено!<br>
                    Удачи :)<br>
                </div>
            </div>
        `);
        const preGameEl = section.sectionContent.querySelector('.pre-game');
        const backButton = new ButtonComponent({ el: preGameEl, className: 'cute-btn pre-game__back-button' });
        backButton.render();
        const playButton = new ButtonComponent({ el: preGameEl, text: 'Начать игру', href: 'play' });
        playButton.render();
    }
}
