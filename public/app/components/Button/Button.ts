import {
    createElementFromHTML,
    noop,
} from '../../modules/Utils';

// declare function TypeCallback(...args: any[]): void;

export default class ButtonComponent {

    _el;
    _href;
    _text;
    _innerElem;
    _listenersToAdd;
    _className;

    constructor({
        el = document.body, href = '/', text = 'Назад', className = 'cute-btn cute-btn--w10rem',
    } = {}) {
        this._el = el;
        this._href = href;
        this._text = text;
        this._innerElem = null;
        this._listenersToAdd = [];
        this._className = className;
    }

    get href() {
        return this._href;
    }

    set href(href) {
        this._href = href;
    }

    render() {
        this._innerElem = createElementFromHTML(`
        <a href="${this._href}" class="${this._className}" data-href="${this._href}">
            ${this._text}
        </a>
        `);
        this._el.appendChild(this._innerElem);
        this._listenersToAdd.forEach( (entry) => {
            this.on(entry);
        });
        this._listenersToAdd = [];
    }


    on({ event = 'click', callback, capture = false }) {
        if (!callback) {
            callback = noop;
        }
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        } else {
            this._listenersToAdd.push({ event, callback, capture });
        }
    }

    off({ event = 'click', callback = noop, capture = false }) {
        this._innerElem.removeEventListener(event, callback, capture);
    }
}
