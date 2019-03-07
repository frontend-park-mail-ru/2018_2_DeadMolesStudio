import BaseView2 from 'views/Base2';
import userState from 'modules/User';
import bus from 'modules/EventBus';
import MenuComponent from 'components/Menu/Menu';
import LoaderComponent from 'components/Loader/Loader';

export default class MenuView extends BaseView2 {

    loader;

    constructor(el) {
        super(el);

        this.loader = null;
        bus.on('user-state-set', this.render.bind(this) );
    }

    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');

        if (userState.isExist() ) {
            this.renderMenu(mainBlock);
            const blockTitle = mainBlock.querySelector('.mainHeaderMenu');
            this.renderTitleGame(blockTitle);
            const title = blockTitle.querySelector('.main-head__img');
            title.classList.add('main-head__img_margin');
        } else {
            this.renderLoading(mainBlock);
        }

    }

    renderMenu(parent) {
        const menu = new MenuComponent({
            el: parent,
            user: userState.getUser(),
            auth: userState.isAuth(),
        });
        menu.render();
    }

    renderLoading(parent) {
this.loader = new LoaderComponent(parent);
        this.loader.render();
        const title = parent.querySelector('.bouncing-loader');
        title.classList.add('menu-loader');
    }
}
