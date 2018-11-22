import BaseView from './Base.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import LinkComponent from '../components/Link/Link.mjs';

import bus from '../modules/EventBus.js';

export default class SignUpView extends BaseView {
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

    fetchSignUp(req, form) {
        bus.emit('fetch-signup-user', { req, form });
    }

    renderForm(parent) {
        const form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Зарегистрироваться!',
            name: 'signup',
        });
        form.render();

        form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                form.hideErrors();

                const formData = form.innerElem.elements;
                const email = formData.email.value;
                const nickname = formData.nickname.value;
                const password = formData.password.value;
                const passwordRepeat = formData.password_repeat.value;

                if (password !== passwordRepeat) {
                    const errors = [{
                        text: 'Пароли не совпадают!',
                    }];
                    form.showErrors(errors);
                    return;
                }

                if (!(email && password && passwordRepeat && nickname) ) {
                    const errors = [{
                        text: 'Заполните все поля!',
                    }];
                    form.showErrors(errors);
                    return;
                }

                const req = {
                    email: email,
                    nickname: nickname,
                    password: password,
                };

                this.fetchSignUp(req, form);
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
