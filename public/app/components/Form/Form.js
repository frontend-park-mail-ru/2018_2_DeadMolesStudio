import { noop } from '../../modules/Utils.js';

export default class FormComponent {
    constructor({ el = document.body, name, header, inputs = [], multipart = false } = {}) {
        this._el = el;
        this._name = name;
        this._header = header;
        this._inputs = inputs;
        this._innerElem = null;
        this._errorsList = null;
        this._multipart = multipart;
    }

    render() {
        const options = {
            name: this._name,
            header: this._header,
            inputs: this._inputs,
        };

        const form = window.formTmplTemplate(options);
        this._el.insertAdjacentHTML('beforeend', form);
        this._innerElem = this._el.querySelector('form');
        if (this._multipart) {
            this._innerElem.setAttribute('enctype', 'multipart/form-data');
        }

        this._errorsList = document.createElement('ul');
        const submitButton = this._innerElem.elements['submit'];
        this._innerElem.insertBefore(this._errorsList, submitButton);
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
        errors.forEach( (item) => {
            this._errorsList.innerHTML += `<li>${item['text']}</li>`;
        });
    }

    hideErrors() {
        this._errorsList.innerHTML = '';
    }
}
