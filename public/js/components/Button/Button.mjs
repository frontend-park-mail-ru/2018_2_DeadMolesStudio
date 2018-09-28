'use strict';

import {
    createElementFromHTML,
    noop,
} from "../../modules/Utils.mjs";

export class ButtonComponent {
    constructor({el = document.body, href = '', text = ''} = {}) {
        this._el = el;
        this._href = href;
        this._text = text;
        this._innerElem = null;
        this._listenersToAdd = [];
    }

    get href() {
        return this._href;
    }

    set href(href) {
        this._href = href;
    }

    render() {
        this._innerElem = createElementFromHTML(`
        <a href="${this._href}" class="cute-btn" data-href="${this._href}">
			${this._text}
		</a>
        `);
        this._el.appendChild(this._innerElem);
        this._listenersToAdd.forEach( entry => {
            this.on(entry);
        } );
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