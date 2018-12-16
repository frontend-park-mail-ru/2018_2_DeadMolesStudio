import BaseView2 from './Base2.ts';
import userState from '../modules/User.ts';
import bus from '../modules/EventBus.js';
import MenuComponent from '../components/Menu/Menu.ts';
import LoaderComponent from '../components/Loader/Loader.ts';

export default class MenuView extends BaseView2 {
    constructor(el) {
        super(el);
        bus.on('user-state-set', this.render.bind(this) );
    }

    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');

        if (userState.isExist() ) {
            this.renderMenu(mainBlock);
        } else {
            this.renderLoading(mainBlock);
        }

        const blockTitle = mainBlock.querySelector('.mainHeader');
        this.renderTitleGame(blockTitle);
        const title = blockTitle.querySelector('.main-head__img');
        title.classList.add('main-head__img_margin');
    }

    renderMenu(parent) {
        const menu = new MenuComponent({
            el: parent,
            titles: this.titles,
            user: userState.getUser(),
            auth: userState.isAuth(),
        });
        menu.render();
    }

    renderLoading(parent) {
        this.loader = new LoaderComponent(parent);
        this.loader.render();
    }
}
