import BaseView from './Base.js';
import userState from '../modules/User.mjs';
import MenuComponent from '../components/Menu/Menu.mjs';
import SectionComponent from '../components/Section/Section.mjs';

export default class MenuView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const menuSection = new SectionComponent({ el: content, name: 'index' });
        menuSection.render();
        const menuContent = menuSection.sectionContent;

        const menu = new MenuComponent({
            el: menuContent,
            titles: this.titles,
        });
        menu.render();

        const playBtn = menuSection.sectionContent.querySelector('.cute-btn');
        playBtn.classList.add('menu__play-button');
        playBtn.animate([
            { transform: 'scale(1)', filter: 'none' },
            { transform: 'scale(1.02)', filter: 'saturate(1.2)' },
        ], {
            duration: 700, // миллисекунды
            easing: 'ease-in-out', // 'linear', кривая Безье, и т.д.
            delay: 30, // миллисекунды
            iterations: Infinity, // или число
            direction: 'alternate', // 'normal', 'reverse', и т.д.
            fill: 'forwards', // 'backwards', 'both', 'none', 'auto'
        });
    }

    get titles() {
        const titles = new Map();
        titles.set('pregame', 'Играть');
        titles.set('profile', 'Профиль');
        titles.set('scoreboard', 'Списки лидеров');
        titles.set('about', 'Об игре');

        if (userState.isAuth() ) {
            titles.set('logout', 'Выход');
        } else {
            titles.set('login', 'Войти');
        }

        return titles;
    }
}
