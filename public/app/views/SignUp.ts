import BaseView from './Base';

import SectionComponent from '../components/Section/Section';
import FormComponent from '../components/Form/Form.js';
import LinkComponent from '../components/Link/Link';

import bus from '../modules/EventBus';

export default class SignUpView extends BaseView {

    form;
    error;

    constructor(el) {
        super(el);

        this.form = null;

        this.error = null;
        bus.on('user:signup-err', this.setError.bind(this) );
    }

    setError(err) {
        this.error = err;
        this.form.showErrors(this.error.errors);
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const signupSection = new SectionComponent({ el: content, name: 'signup' });
        signupSection.render();
        const signupSectionContent = signupSection.sectionContent;

        this.renderForm(signupSectionContent);

        const loginLink = new LinkComponent({
            el: signupSection.sectionContent,
            text: 'У меня уже есть аккаунт',
            href: '/login',
            className: 'sub_link',
        });
        loginLink.render();
    }

    fetchSignUp(formData) {
        bus.emit('fetch-signup-user', formData);
    }

    renderForm(parent) {
        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Зарегистрироваться!',
            name: 'signup',
        });
        this.form.render();

        this.form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                this.form.hideErrors();

                const formData = this.form.innerElem.elements;
                this.fetchSignUp(formData);
            },
        });
    }

    get inputs() {
        return [
            {
                name: 'nickname',
                type: 'text',
                placeholder: 'Логин',
                className: 'bordered_input',
            },
            {
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                className: 'bordered_input',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Пароль',
                className: 'bordered_input',
            },
            {
                name: 'password_repeat',
                type: 'password',
                placeholder: 'Повторите пароль',
                className: 'bordered_input',
            },
            {
                name: 'submit',
                type: 'submit',
                className: 'cute-btn cute-btn--w10rem',
                value: 'Зарегистрироваться',
            },
        ];
    }
}
