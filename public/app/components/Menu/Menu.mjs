import ButtonComponent from '../Button/Button.mjs';
import { noop } from '../../modules/Utils.mjs';

export default class MenuComponent {
    constructor({ el = document.body, titles = {}, actionOnButton = noop } = {}) {
        this._el = el;
        this._titles = titles;
        this._actionOnButton = actionOnButton;
    }

    render() {
        const menu = document.createElement('div');
        menu.className = 'menu';

        this._titles.forEach( (title, href) => {
            const button = new ButtonComponent({
                el: menu,
                href: href,
                text: title,
                className: 'cute-btn cute-btn--w10rem',
            });

            button.on({
                event: 'click',
                callback: this._actionOnButton,
            });

            button.render();
        });

        this._el.appendChild(menu);
    }
}
