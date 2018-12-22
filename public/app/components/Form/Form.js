import { noop } from 'modules/Utils.ts';
import formTmpl from './form.tmpl.pug';

export default class FormComponent {
    // _el;
    // _name;
    // _header;
    // _inputs;
    // _innerElem;
    // _errorsList;
    // _multipart;
    // _btn;

    constructor({
        el = document.body, name = '', header = '', inputs = [], multipart = false, btn,
    } = {}) {
        this._el = el;
        this._name = name;
        this._header = header;
        this._inputs = inputs;
        this._innerElem = null;
        this._errorsList = null;
        this._multipart = multipart;
        this._btn = btn;
    }

    render() {
        const submit = {
            name: 'submit',
            type: 'submit',
            className: 'basic-btn input-block__btn-submit',
            value: this._header,
        };

        const options = {
            header: this._header,
            inputs: this._inputs,
            submit: submit,
            btn: this._btn,
        };

        const form = formTmpl(options);

        this._el.insertAdjacentHTML('beforeend', form);
        this._innerElem = this._el.querySelector('form');
        if (this._multipart) {
            this._innerElem.setAttribute('enctype', 'multipart/form-data');
        }

        const inputFile = this._innerElem.querySelector('.input-block__inputs-img');
        if (inputFile) {
            const labelFile = document.querySelector('.input-block__inputs-item_cursor');
            inputFile.addEventListener('change', (e) => {
                let fileName = e.target.value.split('\\').pop();

                if (fileName.length > 9) {
                    fileName = `${fileName.substr(0, 8)}...`;
                }

                if (fileName) {
                    labelFile.innerHTML = fileName.substr(0, 11);
                }
            });

            const btnDelete = this._innerElem.querySelector('.basic-btn_theme_delete');
            btnDelete.addEventListener('click', (e) => {
                e.preventDefault();
                if (inputFile) {
                    inputFile.value = '';
                    labelFile.innerHTML = 'Choose a file';
                }
            });
        }

        this._innerElem.addEventListener('change', (e) => {
            console.log('onchage form');
        });

        // const link = this._innerElem.querySelector('.find-link');
        // const signUpLink = new LinkComponent({
        //     el: link,
        //     text: 'SignUp',
        //     href: '/signup',
        //     className: 'basic-btn input-block__btn-extra',
        // });
        // signUpLink.render();

        // this._errorsList = document.createElement('ul');
        // // const submitButton = this._innerElem.elements.submit;
        // // this._innerElem.insertBefore(this._errorsList);
        // this._innerElem.appendChild(this._errorsList);
    }

    on({ event = 'click', callback = noop, capture = false }) {
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        } else {
            console.log('You cant add eventListener before render');
        }
    }

    off({ event = 'click', callback = noop, capture = false }) {
        this._innerElem.removeEventListener(event, callback, capture);
    }

    get innerElem() {
        return this._innerElem;
    }

    showErrors(errors = []) {
        const block = document.querySelectorAll('.input-block__inputs-error');
        errors.forEach( (item, idx) => {
            block[idx].innerHTML += item.text;
        });
    }

    hideErrors() {
        // this._errorsList.innerHTML = '';
        const errors = document.querySelectorAll('.input-block__inputs-error');
        errors.forEach( (err) => {
            err.innerHTML = '';
        });
    }
}
