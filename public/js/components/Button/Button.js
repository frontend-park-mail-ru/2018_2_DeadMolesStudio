'use strict';

export class ButtonComponent {
    constructor({el = document.body, href = '', text = ''} = {}) {
        console.log(`new Button(${el}, ${href}, ${text})`);
        this._el = el;
        this._href = href;
        this._text = text;
        this._noop = () => null;
    }

    get href() {
        return this._href;
    }

    set href(href) {
        this._href = href;
    }

    render() {
        this._el.innerHTML += `
        <a href="${this._href}" class="cute-btn" data-href="${this._href}">
			${this._text}
		</a>
        `.trim();
    }

    on({event = 'click', callback = this._noop()}) {
        this._el.addEventListener(event, callback);
    }

    off({event = 'click', callback = this._noop()}) {
        this._el.removeEventListener(event, callback);
    }
}