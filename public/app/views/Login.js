import BaseView from './Base.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import LinkComponent from '../components/Link/Link.mjs';

import bus from '../modules/EventBus.js';

export default class LoginView extends BaseView {
    constructor(el) {
        super(el);

        this.form = null;

        this.error = null;
        bus.on('session:login-err', this.setError.bind(this) );
    }

    setError(err) {
        this.error = err;
        this.form.showErrors(this.error.errors);
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const loginSection = new SectionComponent({ el: content, name: 'login' });
        loginSection.render();
        const loginSectionContent = loginSection.sectionContent;

        this.renderForm(loginSectionContent);

        const signUpLink = new LinkComponent({
            el: loginSection.sectionContent,
            text: 'Зарегистрироваться',
            href: '/signup',
            className: 'sub_link',
        });
        signUpLink.render();
    }

    fetchLogin(formData) {
        bus.emit('fetch-login', formData);
    }

    renderForm(parent) {
        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Войти!',
            name: 'login',
        });

        this.form.render();

        this.form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                this.form.hideErrors();

                const formData = this.form.innerElem.elements;
                this.fetchLogin(formData);
            },
        });
    }

    get inputs() {
        return [
            {
                name: 'email',
                type: 'email',
                placeholder: 'Почта',
                className: 'bordered_input',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Пароль',
                className: 'bordered_input',
            },
            {
                name: 'submit',
                type: 'submit',
                className: 'cute-btn cute-btn--w10rem',
                value: 'Войти',
            },
        ];
    }
}
