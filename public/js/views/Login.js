import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import LinkComponent from '../components/Link/Link.mjs';

import bus from '../modules/EventBus.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class LoginView extends BaseView {
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

    // show() {
    //     super.show();
    // }

    fetchLogin(req, form) {
        bus.emit('fetch-login', { req, form });
    }

    renderForm(parent) {
        const form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Войти!',
            name: 'login',
        });

        form.render();

        form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                form.hideErrors();

                const formData = form.innerElem.elements;
                const email = formData.email.value;
                const password = formData.password.value;

                if (!(email && password) ) {
                    const errors = [{
                        text: 'Заполните оба поля!',
                    }];
                    form.showErrors(errors);
                    return;
                }

                const req = {
                    email: email,
                    password: password,
                };

                this.fetchLogin(req, form);
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
