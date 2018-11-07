import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import bus from '../modules/EventBus.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';

// TODO fetch добавить в bus

export default class EditProfileView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const editProfileSection = new SectionComponent({ el: content, name: 'edit_profile' });
        editProfileSection.render();
        const editSectionContent = editProfileSection.sectionContent;

        const loader = new LoaderComponent(editSectionContent);
        loader.render();

        AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            })
            .then( (response) => {
                const { status } = response;
                switch (status) {
                case 200:
                    loader.hide();
                    response.json()
                        .then( (data) => {
                            const profile = data;
                            const inputs = [
                                {
                                    name: 'nickname',
                                    type: 'text',
                                    placeholder: profile.nickname,
                                    className: 'bordered_input',
                                },
                                {
                                    name: 'email',
                                    type: 'email',
                                    placeholder: profile.email,
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
                                    name: 'avatar',
                                    type: 'file',
                                    accept: 'image/jpeg,image/png',
                                    className: 'bordered_input',
                                },
                                {
                                    name: 'submit',
                                    type: 'submit',
                                    className: 'cute-btn',
                                    value: 'Сохранить',
                                },
                            ];

                            const form = new FormComponent({
                                el: editSectionContent,
                                inputs: inputs,
                                header: 'Настройки профиля',
                                // TODO указать правильный name
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
                                    const avatar = formData.avatar;

                                    const req = {};

                                    if (avatar) {
                                        // console.log('avatar block');
                                        // console.log(avatar.value);
                                        const avatarData = new FormData();
                                        const newAvatar = formData.avatar.files[0];
                                        avatarData.append('avatar', newAvatar);

                                        AjaxFetchModule
                                            .doPost({
                                                path: '/profile/avatar',
                                                domain: backDomain,
                                                contentType: 'multipart/form-data',
                                                body: avatarData,
                                            })
                                            .then( (response) => {
                                                console.log(response.status);
                                            })
                                            .catch( () => {
                                                console.log('errorrr');
                                            });
                                    }

                                    if (email !== profile.email) {
                                        req.email = email;
                                    }

                                    if (nickname !== profile.nickname) {
                                        req.nickname = nickname;
                                    }

                                    if (password) {
                                        if (password !== passwordRepeat) {
                                            const errors = [{
                                                text: 'Пароли не совпадают!',
                                            }];
                                            form.showErrors(errors);
                                            return;
                                        }
                                        req.password = password;
                                    }

                                    AjaxFetchModule
                                        .doPut({
                                            path: '/profile',
                                            domain: backDomain,
                                            body: req,
                                        })
                                        .then( (response) => {
                                            const { status } = response;

                                            switch (status) {
                                            case 200:
                                                bus.emit('editprofile');
                                                break;
                                            case 400:
                                                console.log('JSON is wrong');
                                                bus.emit('showprofile');
                                                break;
                                            case 401:
                                                alert('Надо авторизоваться');
                                                bus.emit('tologin');
                                                break;
                                            case 403:
                                                response.json()
                                                    .then( (data) => {
                                                        const errorList = data.error;
                                                        form.showErrors(errorList);
                                                    });
                                                break;
                                            default:
                                                alert('Что-то пошло не так!');
                                                bus.emit('showprofile');
                                            }
                                        }).catch( (err) => {
                                            console.log(err);
                                            alert('Что-то пошло не так!');
                                            bus.emit('showmenu');
                                        });
                                },
                            });

                            const profileButton = new ButtonComponent({
                                el: editSectionContent,
                                href: '/profile',
                                text: 'Назад',
                            });
                            profileButton.render();
                        });
                    break;
                case 401:
                    alert('Надо авторизоваться');
                    bus.emit('tologin');
                    break;
                default:
                    alert('Что-то пошло не так.');
                    bus.emit('showmenu');
                    break;
                }
            })
            .catch( (err) => {
                console.log(err);
                alert('Что-то пошло не так!');
                bus.emit('showmenu');
            });
    }
}
