import MenuComponent from '../components/Menu/Menu.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import BaseView from './Base.js';

export default class MenuView extends BaseView {
    constructor(el) {
        console.log('MenuView()');
        super(el);
    }

    // show() {
    //     this._el.hidden = false;
    // }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const menuSection = new SectionComponent({ el: content, name: 'index' });
        menuSection.render();

        const titles = new Map();
        titles.set('play', 'Играть');
        titles.set('profile', 'Профиль');
        titles.set('scoreboard', 'Списки лидеров');
        titles.set('about', 'Об игре');
        titles.set('logout', 'Выход');

        const menu = new MenuComponent({
            el: menuSection.sectionContent,
            titles: titles,
            actionOnButton: (event) => {
                // event.preventDefault();
                // const link = event.target;
                // ViewsContext.hideAnySection();
                // ViewsContext.pages[link.dataset.href]();
            },
        });

        menu.render();
    }
}
