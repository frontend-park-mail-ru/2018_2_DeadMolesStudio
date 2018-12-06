import ErrorComponent from '../components/Error/Error.mjs';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import backDomain from '../projectSettings.js';
import BaseView from './Base.js';


import bus from '../modules/EventBus.js';
import SectionComponent from '../components/Section/Section.mjs';
import FormComponent from '../components/Form/Form.mjs';
import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';


export default class EditProfileView extends BaseView {
    constructor(el) {
        super(el);

        this.form = null;

        this.user = null;
        bus.on('user:get-profile', this.setUser.bind(this) );

        this.error = null;
        bus.on('user:get-profile-err', this.setError.bind(this) );
        bus.on('user:update-err', this.setErrorUpdate.bind(this) );
    }

    setError(err) {
        this.error = err.text;
        this.render();
    }

    setErrorUpdate(err) {
        this.error = err.mainErr;
        if (this.error !== null) {
            this.render();
        } else {
            this.form.showErrors(err.errors);
        }
    }

    show() {
        super.show();
        this.fetchUser();
    }

    fetchUser() {
        bus.emit('fetch-user');
    }

    fetchUpdate(formData) {
        bus.emit('fetch-update-user', { formData: formData, user: this.user });
    }

    setUser(user) {
        this.user = user;
        this.render();
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const editProfileSection = new SectionComponent({ el: content, name: 'edit_profile' });
        editProfileSection.render();
        const editSectionContent = editProfileSection.sectionContent;

        const changingBlock = document.createElement('div');
        editSectionContent.appendChild(changingBlock);

        const profileButton = new ButtonComponent({
            el: editSectionContent,
            href: '/profile',
            text: 'Назад',
        });
        profileButton.render();

        if (!this.user && !this.error) {
            this.renderLoading(changingBlock);
        } else if (this.error) {
            this.renderError(editSectionContent);
            this.error = null;
        } else {
            this.renderForm(changingBlock);
        }
    }

    renderForm(parent) {
        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Настройки профиля',
            // TODO указать правильный name
            name: 'signup',
            multipart: true,
        });
        this.form.render();

        this.form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();
                this.form.hideErrors();

                const formData = this.form.innerElem.elements;
                const avatar = this.form.innerElem.querySelector('input[name ="avatar"]');

                if (avatar.value !== '') {
                    const avatarData = new FormData();
                    avatarData.append('avatar', avatar.files[0], avatar.value);

                    console.log(avatarData.has('avatar') );
                    // console.log(avatarData.values() );


                    AjaxFetchModule
                        .doPut({
                            path: '/profile/avatar',
                            domain: backDomain,
                            contentType: 'multipart/form-data',
                            body: avatarData,
                        })
                        .then( (response) => {
                            console.log(response);
                            console.log(response.status);
                        })
                        .catch( (err) => {
                            console.log(err);
                        });
                }


                // console.log(avatar);
                // console.log(avatar.files[0]);
                // console.log(avatar.name);

                // const f = this.form.innerElem;
                //
                // const а = new FormData(formData);
                // console.log(a);

                // console.log('edit profile');
                // console.log(formData);
                // // console.log(f);
                //
                // const userAvatar = formData.avatar;
                //
                // if (userAvatar) {
                //     console.log('ecnm');
                //     console.log(userAvatar);
                // } else {
                //     console.log('no');
                // }
                //
                // if (userAvatar.value === '') {
                //     console.log('пусто');
                // } else {
                //     console.log('ytn');
                //     console.log(formData.avatar.files[0]);
                //     console.log(formData.avatar.name);
                // }

                // if (userAvatar.value !== '') {
                //     console.log('avatar block');
                //     console.log(userAvatar.value);
                //     // // && this.user.avatar !== userAvatar
                //     //     console.log(userAvatar);
                //     const avatarData = new FormData();
                //     const newAvatar = formData.avatar.files[0];
                //     avatarData.append('avatar', newAvatar);
                //
                //     AjaxFetchModule
                //         .doPut({
                //             path: '/profile/avatar',
                //             domain: backDomain,
                //             contentType: 'multipart/form-data',
                //             body: avatarData,
                //         })
                //         .then( (response) => {
                //             console.log(response.status);
                //         })
                //         .catch( (err) => {
                //             console.log(err);
                //         });
                // }

                this.fetchUpdate(formData);
            },
        });
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    renderError(parent) {
        const errorBlock = new ErrorComponent({
            el: parent,
            error: this.error,
        });

        errorBlock.render();
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
                // accept: 'image/jpeg,image/png',
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
