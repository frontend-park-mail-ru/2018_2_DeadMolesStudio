import {
    createElementFromHTML,
    noop
} from "../../modules/Utils.mjs";

export class LinkComponent {
    constructor({el = document.body, text = '', href = '', className = 'default_link'}) {
        this._el = el;
        this._text = text;
        this._href = href;
        this._className = className;
        this._innerElem = null;
        this._listenersToAdd = [];
    }

    render() {
        this._innerElem = createElementFromHTML(`<a href="${this._href}" class="${this._className}" data-href="${this._href}">${this._text}</a>`);
        this._el.appendChild(this._innerElem);

        this._listenersToAdd.forEach( entry => this.on(entry) );
        this._listenersToAdd = [];
    }

    on({event = 'click', callback = noop, capture = false}) {
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        } else {
            this._listenersToAdd.push({event: event, callback: callback, capture: capture});
        }
    }

    off({event = 'click', callback = noop, capture = false}) {
        this._innerElem.removeEventListener(event, callback, capture);
    }
}