import View from 'views/View';

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

        parent.insertAdjacentHTML('afterbegin', `
            <a class="main-head app-router-use" href="/">
                <img src="../img/main-header.png" alt="" class="main-head__img app-router-use">
            </a>
        `);
    }
}
