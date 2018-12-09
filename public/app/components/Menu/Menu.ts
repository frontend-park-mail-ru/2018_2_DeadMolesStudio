import ButtonComponent from '../Button/Button';
import { noop } from '../../modules/Utils';

export default class MenuComponent {

    _el;
    _titles;
    _actionOnButton;

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
