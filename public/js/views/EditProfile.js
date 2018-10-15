import {SectionComponent} from "../components/Section/Section.mjs";
import {AjaxFetchModule} from "../modules/AjaxFetch.mjs";
import * as ViewsContext from "./ViewsContext.js";
import {showLogin} from "./Login.js";
import {showMenu} from "./Menu.js";
import {FormComponent} from "../components/Form/Form.mjs";
import {showProfile} from "./Profile.js";
import {ButtonComponent} from "../components/Button/Button.mjs";
import {hideAnySection, pages} from "./ViewsContext.js";

export const showEditProfile = () => {
    const content = document.querySelector(".content");

    const editProfileSection = new SectionComponent({el: content, name: 'signup'});
    editProfileSection.render();

    const em = document.createElement('em');
    em.textContent = 'Loading';
    editProfileSection.append(em);

    AjaxFetchModule.doGet({
        path: '/profile',
        domain: ViewsContext.backDomain,
    }).then( (response) => {
        const status = response.status;
        switch (status) {
            case 200:
                response.json().then((data) => {
                    const profile = data;
                    const inputs = [
                        {
                            name: "nickname",
                            type: "text",
                            placeholder: profile.nickname,
                            className: "bordered_input"
                        },
                        {
                            name: "email",
                            type: "email",
                            placeholder: profile.email,
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
                            name: 'avatar',
                            type: 'file',
                            accept: 'image/jpeg,image/png',
                            className: "bordered_input"
                        },
                        {
                            name: "submit",
                            type: "submit",
                            className: "cute-btn",
                            value: 'Сохранить'
                        }
                    ];

                    const form = new FormComponent({
                        el: editProfileSection.sectionContent,
                        inputs: inputs,
                        header: 'Настройки профиля',
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

                            const req = {};

                            if (email !== profile.email) {
                                req['email'] = email;
                            }

                            if (nickname !== profile.nickname) {
                                req['nickname'] = nickname;
                            }

                            if (password) {
                                if (password !== passwordRepeat) {
                                    const errors = [{
                                        text: 'Пароли не совпадают!'
                                    }];
                                    form.showErrors(errors);
                                    return;
                                } else {
                                    req['password'] = password;
                                }
                            }

                            AjaxFetchModule.doPut({
                                path: '/profile',
                                domain: ViewsContext.backDomain,
                                body: req
                            }).then((response) => {
                                const status = response.status;

                                switch (status) {
                                    case 200:
                                        ViewsContext.hideAnySection();
                                        showEditProfile();
                                        break;
                                    case 400:
                                        console.log('JSON is wrong');
                                        ViewsContext.hideAnySection();
                                        showProfile();
                                        break;
                                    case 401:
                                        alert('Надо авторизоваться');
                                        ViewsContext.hideAnySection();
                                        showLogin();
                                        break;
                                    case 403:
                                        response.json().then((data) => {
                                            const errorList = data['error'];
                                            form.showErrors(errorList)
                                        });
                                        break;
                                    default:
                                        alert('Что-то пошло не так!');
                                        ViewsContext.hideAnySection();
                                        showProfile();

                                }
                            }).catch((err) => {
                                console.log(err);
                                alert('Что-то пошло не так!');
                                ViewsContext.hideAnySection();
                                showMenu();
                            });
                        },
                    });
                });

                const buttonToProfile = new ButtonComponent({
                    el: editProfileSection,
                    href: 'profile',
                    text: 'Назад'
                });
                buttonToProfile.on({
                    event: 'click',
                    callback: (event) => {
                        event.preventDefault();
                        const link = event.target;
                        hideAnySection();
                        pages[ link.dataset.href ]();
                    },
                });
                buttonToProfile.render();
                break;
            case 401:
                alert('Надо авторизоваться');
                ViewsContext.hideAnySection();
                showLogin();
                break;
            default:
                alert('Что-то пошло не так.');
                ViewsContext.hideAnySection();
                showMenu();
                break;
        }
    }).catch( (err) => {
        console.log(err);
        alert('Что-то пошло не так!');
        ViewsContext.hideAnySection();
        showMenu();
    });





};
