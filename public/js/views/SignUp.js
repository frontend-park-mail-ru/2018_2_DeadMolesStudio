import * as ViewsContext from "./ViewsContext.js";
import {SectionComponent} from "../components/Section/Section.mjs";
import {FormComponent} from "../components/Form/Form.mjs";
import {LinkComponent} from "../components/Link/Link.mjs";
import  {showProfile} from "./Profile.js";
import {AjaxFetchModule} from "../modules/AjaxFetch.mjs";

export const showSignUp = () => {
    const content = document.querySelector(".content");

    const signupSection = new SectionComponent({el: content, name: 'signup'});
    signupSection.render();

    const inputs = [
        {
            name: "nickname",
            type: "text",
            placeholder: "Логин",
            className: "bordered_input"
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            className: "bordered_input"
        },
        {
            name: "password",
            type: "password",
            placeholder: "Пароль",
            className: "bordered_input"
        },
        {
            name: "password_repeat",
            type: "password",
            placeholder: "Повторите пароль",
            className: "bordered_input"
        },
        {
            name: "submit",
            type: "submit",
            className: "cute-btn",
            value: 'Зарегистрироваться'
        }
    ];

    const form = new FormComponent({
        el: signupSection.sectionContent,
        inputs: inputs,
        header: 'Зарегистрироваться!',
        name: 'signup',
    });

    form.render();

    form.on({
        event: 'submit',
        callback: event => {
            event.preventDefault();

            form.hideErrors();

            const formData = form.innerElem.elements;
            const email = formData['email'].value;
            const nickname = formData['nickname'].value;
            const password = formData['password'].value;
            const passwordRepeat = formData['password_repeat'].value;

            if ( password !== passwordRepeat ) {
                const errors = [{
                    text: 'Пароли не совпадают!'
                }];
                form.showErrors(errors);
                return;
            }

            if ( !(email && password && passwordRepeat && nickname) ) {
                const errors = [{
                    text: 'Заполните все поля!'
                }];
                form.showErrors(errors);
                return;
            }

            const req = {
                    email: email,
                    nickname: nickname,
                    password: password,
            };

            AjaxFetchModule.doPost({
                path: '/profile',
                domain: ViewsContext.backDomain,
                body: req
            }).then( (response) => {
                return response.status;
            }).then( (status) => {
                if ( status === 200 ) {
                    ViewsContext.hideAnySection();
                    showProfile();
                } else if ( status === 400 ) {
                    console.log('JSON is wrong');
                    ViewsContext.hideAnySection();
                    showSignUp();
                } else if ( status === 403 ) {
                    const errors = [{
                        text: 'Что-то пошло не так!'
                    }];
                    form.showErrors(errors);
                    //TODO надо пофиксить обработку ошибки
                    // const errors = JSON.parse(xhr.responseText);
                    // const errorList = errors['error'];
                    // form.showErrors(errorList);
                } else {
                    const errors = [{
                        text: 'Что-то пошло не так!'
                    }];
                    form.showErrors(errors);
                }
            });

        },
    });

    const loginLink = new LinkComponent({
        el: signupSection.sectionContent,
        text: "У меня уже есть аккаунт",
        href: 'login',
        className: "sub_link",
    });
    loginLink.on({
        event: "click",
        callback: event => {
            event.preventDefault();
            const link = event.target;
            ViewsContext.hideAnySection();
            ViewsContext.pages[ link.dataset.href ]();
        },
    });

    loginLink.render();
};