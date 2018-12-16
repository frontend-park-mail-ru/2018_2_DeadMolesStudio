import ButtonComponent from '../Button/Button';
import {noop} from '../../modules/Utils';

export default class ErrorComponent {

    _el;
    _path;
    _error;
    _onAccept;

    constructor({ el = document.body, path = '/', error = 'Что-то пошло не так :(', callback = noop} = {}) {
        this._el = el;
        this._path = path;
        this._error = error;
        this._onAccept = callback;
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
        okButton.on({
            event: 'click',
            callback: this._onAccept,
        });
    }
}
