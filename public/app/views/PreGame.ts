import BaseView2 from './Base2';

import SectionComponent from '../components/Section/Section';
import ButtonComponent from '../components/Button/Button';
import UserState from '../modules/User';

export default class PreGameView extends BaseView2{
    render() {
        super.render();
        const content = this._el.querySelector('.container');
        const section = new SectionComponent({ el: content, name: 'pregame' });
        section.render();
        // const title = this._el.querySelector('.game_title');
        // content.removeChild(title);
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
        const singlePlayerButton = new ButtonComponent({ el: preGameEl, text: 'Одиночная игра', href: 'play' });
        singlePlayerButton.render();

        if (UserState.isAuth()) {
            const multiPlayerButton = new ButtonComponent({ el: preGameEl, text: 'Сетевая игра', href: 'multiplayer' });
            multiPlayerButton.render();
        }
    }
}
