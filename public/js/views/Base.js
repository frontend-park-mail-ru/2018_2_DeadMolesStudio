import * as ViewsContext from "./ViewsContext.js";
import {LinkComponent} from "../components/Link/Link.mjs";

export const showBase = () => {
    ViewsContext.rootElement.innerHTML = `
        <div class="container">
            <div class="content">
                <div class="game_title">
                </div>
            </div>
        </div>
    `.trim();
    const gameTitle = document.querySelector('.game_title');

    const h1 = document.createElement('h1');
    gameTitle.appendChild(h1);

    const gameTitleLink = new LinkComponent({
        el: h1,
        text: 'Abstract Ketnipz ((',
        href: 'index',
        className: "game_title__link",
    });

    gameTitleLink.on({
        event: 'click',
        callback: event => {
            event.preventDefault();
            const link = event.target;
            ViewsContext.hideAnySection();
            ViewsContext.pages[ link.dataset.href ]();
        },
    });

    gameTitleLink.render();
};