import BaseView from './Base.ts';
import userState from '../modules/User.ts';
import bus from '../modules/EventBus.js';
import MenuComponent from '../components/Menu/Menu.ts';
import SectionComponent from '../components/Section/Section.ts';
import LoaderComponent from '../components/Loader/Loader.js';

export default class MenuView extends BaseView {
    constructor(el) {
        super(el);
        bus.on('user-state-set', this.render.bind(this) );
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const menuSection = new SectionComponent({ el: content, name: 'index' });
        menuSection.render();
        const menuContent = menuSection.sectionContent;

        if (userState.isExist() ) {
            this.renderMenu(menuContent);
            this.setPlayBtn(menuContent);
        } else {
            this.renderLoading(menuContent);
        }
    }

    setPlayBtn(parent) {
        const playBtn = parent.querySelector('.cute-btn');
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


    renderMenu(parent) {
        const menu = new MenuComponent({
            el: parent,
            titles: this.titles,
        });
        menu.render();
    }

    renderLoading(parent) {
        this.loader = new LoaderComponent(parent);
        this.loader.render();
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
