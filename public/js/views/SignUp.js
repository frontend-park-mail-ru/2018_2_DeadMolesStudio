import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import LinkComponent from '../components/Link/Link.mjs';

import bus from '../modules/EventBus.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class SignUpView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const signupSection = new SectionComponent({ el: content, name: 'signup' });
        signupSection.render();
        const signupSectionContent = signupSection.sectionContent;

        const inputs = [
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

        const form = new FormComponent({
            el: signupSectionContent,
            inputs: inputs,
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

                // TODO обработка ошибок и переходы в fetch
                AjaxFetchModule.doPost({
                    path: '/profile',
                    domain: backDomain,
                    body: req,
                })
                    .then( (response) => {
                        const { status } = response;
                        if (status === 200) {
                            bus.emit('showprofile');
                            return;
                        }
                        response.json()
                            .then( (body) => {
                                let { error: errors } = body;
                                if (!errors) errors = [];
                                form.hideErrors();
                                switch (status) {
                                case 400:
                                    console.log('JSON is wrong!');
                                    errors.push({
                                        text: 'Что-то пошло не так! Попробуйте позже!',
                                    });
                                    form.showErrors(errors);
                                    break;
                                case 403:
                                    form.showErrors(errors);
                                    break;
                                case 422:
                                    errors.push({
                                        text: 'Заполните все поля!',
                                    });
                                    form.showErrors(errors);
                                    break;
                                default:
                                    errors.push({
                                        text: 'Что-то пошло не так!',
                                    });
                                    form.showErrors(errors);
                                    break;
                                }
                            });
                    })
                    .catch( (err) => {
                        console.log(err);
                    });
            },
        });

        const loginLink = new LinkComponent({
            el: signupSection.sectionContent,
            text: 'У меня уже есть аккаунт',
            href: '/login',
            className: 'sub_link',
        });
        loginLink.render();
    }
}
