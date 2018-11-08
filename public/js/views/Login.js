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

        const inputs = [
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

        const form = new FormComponent({
            el: loginSection.sectionContent,
            inputs: inputs,
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

                AjaxFetchModule.doPost({
                    path: '/session',
                    domain: backDomain,
                    body: req,
                })
                    .then(response => response.status)
                    .then( (status) => {
                        if (status === 200) {
                            bus.emit('showprofile');
                        } else if (status === 400) {
                            console.log('JSON is wrong');
                            bus.emit('tosignup');
                        } else if (status === 422) {
                            const errors = [{
                                text: 'Неверная пара почта/пароль',
                            }];
                            form.showErrors(errors);
                        } else {
                            const errors = [{
                                text: 'Что-то пошло не так!',
                            }];
                            form.showErrors(errors);
                        }
                    }).catch( (err) => {
                        console.log(err);
                    });
            },
        });

        const signUpLink = new LinkComponent({
            el: loginSection.sectionContent,
            text: 'Зарегистрироваться',
            href: '/signup',
            className: 'sub_link',
        });
        signUpLink.render();
    }
}
