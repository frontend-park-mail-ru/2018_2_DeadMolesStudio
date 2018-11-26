import ButtonComponent from '../Button/Button.mjs';

export default class ErrorComponent {
    constructor({ el = document.body, path = '/', error } = {}) {
        this._el = el;
        this._path = path;
        this._error = error;
    }

    render() {
        this._el.innerHTML = '';

        const block = document.createElement('div');
        block.className = 'errorBlock';
        block.innerHTML += this._error;

        this._el.appendChild(block);

        const okButton = new ButtonComponent({
            el: this._el,
            href: this._path,
            text: 'OK',
        });
        okButton.render();
    }
}
