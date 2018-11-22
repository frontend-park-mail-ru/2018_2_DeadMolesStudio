import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import bus from '../modules/EventBus.js';

import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';


export default class EditProfileView extends BaseView {
    constructor(el) {
        super(el);
        this.user = null;

        bus.on('user:get-profile', this.setUser.bind(this) );
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    show() {
        super.show();
        this.fetchUser();
    }

    fetchUser() {
        bus.emit('fetch-user');
    }

    fetchUpdate(req, form) {
        bus.emit('fetch-update-user', { req, form });
    }

    setUser(user) {
        this.user = user;
        this.render();
    }

    renderForm(parent) {
        const form = new FormComponent({
            el: parent,
            inputs: this.inputs,
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
                const userAvatar = formData.avatar;

                if (userAvatar) {
                    console.log('ecnm');
                    console.log(userAvatar);
                } else {
                    console.log('no');
                }

                if (userAvatar.value === '') {
                    console.log('пусто');
                } else {
                    console.log('ytn');
                    console.log(formData.avatar.files[0]);
                }

                if (userAvatar.value !== '') {
                    console.log('avatar block');
                    console.log(userAvatar.value);
                    // // && this.user.avatar !== userAvatar
                    //     console.log(userAvatar);
                    const avatarData = new FormData();
                    const newAvatar = formData.avatar.files[0];
                    avatarData.append('avatar', newAvatar);

                    AjaxFetchModule
                        .doPut({
                            path: '/profile/avatar',
                            domain: backDomain,
                            contentType: 'multipart/form-data',
                            body: formData.avatar.files[0],
                        })
                        .then( (response) => {
                            console.log(response.status);
                        })
                        .catch( (err) => {
                            console.log(err);
                        });
                }

                const req = {};

                if (email !== this.user.email) {
                    req.email = email;
                }

                if (nickname !== this.user.nickname) {
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

                this.fetchUpdate(req, form);
            },
        });
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const editProfileSection = new SectionComponent({ el: content, name: 'edit_profile' });
        editProfileSection.render();
        const editSectionContent = editProfileSection.sectionContent;

        const changingBlock = document.createElement('div');
        editSectionContent.appendChild(changingBlock);

        if (!this.user) {
            this.renderLoading(changingBlock);
        } else {
            this.renderForm(changingBlock);
        }

        const profileButton = new ButtonComponent({
            el: editSectionContent,
            href: '/profile',
            text: 'Назад',
        });
        profileButton.render();
    }

    get inputs() {
        return [
            {
                name: 'nickname',
                type: 'text',
                placeholder: this.user.nickname,
                className: 'bordered_input',
            },
            {
                name: 'email',
                type: 'email',
                placeholder: this.user.email,
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
    }
}
