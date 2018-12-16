import View from './View';
import LinkComponent from '../components/Link/Link';

/*
* @class BaseView - для создания вьюх, предпологающих наличие "рыбы" с позиционированием и тд
* @module Views
*/
export default class BaseView2 extends View {
    render() {
        this._el.innerHTML = `
            <div class="container"></div>
        `.trim();
    }

    renderTitleGame(parent) {
        parent.insertAdjacentHTML('beforeend', `
            <div class="main-head">
                <img src="../img/main-header.png" alt="" class="main-head__img">
            </div>
        `);

        // const gameTitleLink = new LinkComponent({
        //     el: parent,
        //     text: 'Abstract Ketnipz',
        //     href: '/',
        //     className: 'game_title__link',
        // });
        // gameTitleLink.render();
    }
}
