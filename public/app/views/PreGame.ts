import BaseView2 from './Base2';
import SectionComponent from '../components/Section/Section';
import ButtonComponent from '../components/Button/Button';
import UserState from '../modules/User';
import BackButtonComponent from "../components/BackButton/BackButton";
import GridComponent from "../components/Grid/Grid";
import PreGameComponent from "../components/PreGame/PreGame";

export default class PreGameView extends BaseView2{
    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');
        mainBlock.classList.add('container_pregame');
        mainBlock.classList.remove('container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'pregame',
            structure: this.structureView,
        });
        grid.render();

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();

        const single = new PreGameComponent({
            el: grid.getItem('preGameBlock1'),
        });

        single.render();

        const multi = new PreGameComponent({
            el: grid.getItem('preGameBlock2'),
            type: 'Multiplayer',
        });

        multi.render();

        if (!UserState.isAuth() || !navigator.onLine) {
            const block = mainBlock.querySelector('.pregame-multiplayer');
            block.classList.add('pregame-block_not_auth');
            const button = block.querySelector('.basic-btn');
            button.classList.add('basic-btn_none');

            if (navigator.onLine) {
                const wrapBlock = mainBlock.querySelector('.wrap-multiplayer');

                const signUp = new ButtonComponent({
                    el: wrapBlock,
                    text: 'Login',
                    className: 'basic-btn basic-btn_theme_signup basic-btn_absolute',
                    href: '/login',
                });
                signUp.render();
            }
        }



        // const section = new SectionComponent({ el: content, name: 'pregame' });
        // section.render();
        // // const title = this._el.querySelector('.game_title');
        // // content.removeChild(title);
        // section.sectionContent.insertAdjacentHTML('beforeend', `
        //     <div class="pre-game">
        //         <div class="pre-game__rules">
        //              <h1>Обучение</h1>
        //             В игре есть список покупок.<br>
        //             Вам надо ловить продукты из списка покупок, <br>
        //             передвигая героя при помощи клавиш-стрелок или при помощи наклонов смартфона.<br>
        //             Прыжок: пробел или касание экрана.<br>
        //             За продукты из списка вы получите <b>+3</b> очка.<br>
        //             За ловлю других штраф <b>-1</b> очко.<br>
        //             Время ограничено!<br>
        //             Удачи :)<br>
        //         </div>
        //     </div>
        // `);
        // const preGameEl = section.sectionContent.querySelector('.pre-game');
        // const backButton = new ButtonComponent({ el: preGameEl, className: 'cute-btn pre-game__back-button' });
        // backButton.render();
        // const singlePlayerButton = new ButtonComponent({ el: preGameEl, text: 'Одиночная игра', href: 'play' });
        // singlePlayerButton.render();
        //
        // if (UserState.isAuth()) {
        //     const multiPlayerButton = new ButtonComponent({ el: preGameEl, text: 'Сетевая игра', href: 'multiplayer' });
        //     multiPlayerButton.render();
        // }
    }

    get structureView() {
        return [
            'preGameBlock1',
            'preGameBlock2',
            'backButton',
        ];
    }
}
