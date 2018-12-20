import ButtonComponent from 'components/Button/Button';
import {noop} from 'modules/Utils';

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
        this._el.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-block wrap-block_theme_profile">
                <div class="main-block_theme_error main-block">
                    <div class="main-block__header_theme_error">
                        <h1 class="header header_theme_pink">Ouch!</h1>
                    </div>
                    <div class="error-block">
                        <div class="error-block__text"></div>
                        <div class="error-block__button"></div>
                    </div>
                </div>
            </div>
            `.trim()
        );

        const textBlock = this._el.querySelector('.error-block__text');
        const btnBlock = this._el.querySelector('.error-block__button');

        textBlock.innerHTML += this._error;

        const okButton = new ButtonComponent({
            el: btnBlock,
            href: this._path,
            text: 'OK',
            className: 'basic-btn basic-btn_theme_error',
        });
        okButton.render();

        okButton.on({
            event: 'click',
            callback: this._onAccept,
        });
    }
}
