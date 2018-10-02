import {MenuComponent} from "../components/Menu/Menu.mjs";
import {SectionComponent} from "../components/Section/Section.mjs";
import * as ViewsContext from "./ViewsContext.js"

export const showMenu = () => {
    const content = document.querySelector('.content');

    const menuSection = new SectionComponent({el: content, name: 'index'});
    menuSection.render();

    const titles = new Map();
    titles.set('index', 'Играть');
    titles.set('profile', 'Профиль');
    titles.set('scoreboard', 'Списки лидеров');
    titles.set('about', 'Об игре');
    titles.set('login', 'Выход');

    const menu = new MenuComponent({
        el: menuSection.sectionContent,
        titles: titles,
        actionOnButton: (event) => {
            event.preventDefault();
            const link = event.target;
            hideAnySection();
            ViewsContext.pages[ link.dataset.href ]();
        }
    });

    menu.render();
};