import ErrorComponent from '../components/Error/Error.ts';
import BaseView from './Base.ts';
import bus from '../modules/EventBus.js';
import SectionComponent from '../components/Section/Section.ts';
import FormComponent from '../components/Form/Form.js';
import ButtonComponent from '../components/Button/Button.ts';
import LoaderComponent from '../components/Loader/Loader.ts';


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
