import View from './View.js';
import LinkComponent from '../components/Link/Link.mjs';

/*
* @class BaseView - для создания вьюх, предпологающих наличие "рыбы" с позиционированием и тд
* @module Views
*/
export default class BaseView extends View {
    render() {
        this._el.innerHTML = `
            <div class="container">
                <div class="content">
                    <div class="game_title">
                    </div>
                </div>
            </div>
        `.trim();
        const gameTitle = this._el.querySelector('.game_title');

        const h1 = document.createElement('h1');
        h1.className = 'game_title__h';
        gameTitle.appendChild(h1);

        const gameTitleLink = new LinkComponent({
            el: h1,
            text: 'Abstract Ketnipz',
            href: '/',
            className: 'game_title__link',
        });
        gameTitleLink.render();
    }
}
