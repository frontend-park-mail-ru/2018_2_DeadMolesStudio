import * as ViewsContext from './ViewsContext.js';
import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import LinkComponent from '../components/Link/Link.mjs';
import { showProfile } from './Profile.js';
import { showSignUp } from './SignUp.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import BaseView from './Base.js';

export default class LoginView extends BaseView {
    constructor(el) {
        console.log('LoginView()');
        super(el);
    }

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
                className: 'cute-btn',
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

                if ( !(email && password) ) {
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
                    domain: ViewsContext.backDomain,
                    body: req,
                })
                    .then(response => response.status)
                    .then( (status) => {
                        if (status === 200) {
                            ViewsContext.hideAnySection();
                            showProfile();
                        } else if (status === 400) {
                            console.log('JSON is wrong');
                            ViewsContext.hideAnySection();
                            showSignUp();
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
            href: 'sign_up',
            className: 'sub_link',
        });
        signUpLink.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                const link = event.target;
                ViewsContext.hideAnySection();
                ViewsContext.pages[link.dataset.href]();
            },
        });

        signUpLink.render();
    };
}
