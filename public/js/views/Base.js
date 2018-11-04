import * as ViewsContext from './ViewsContext.js';
import LinkComponent from '../components/Link/Link.mjs';
import View from './View.js';

/*
* @class BaseView - для создания вьюх, предпологающих наличие "рыбы" с позиционированием и тд
* @module Views
*/
export default class BaseView extends View {
    constructor(el) {
        console.log('BaseView()');
        super(el);
    }

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
        gameTitle.appendChild(h1);

        const gameTitleLink = new LinkComponent({
            el: h1,
            text: 'Abstract Ketnipz',
            href: '/',
            className: 'game_title__link',
        });

        gameTitleLink.on({
            event: 'click',
            callback: (event) => {
                // event.preventDefault();
                // const link = event.target;
                // ViewsContext.hideAnySection();
                // ViewsContext.pages[link.dataset.href]();
            },
        });

        gameTitleLink.render();
    }
}
