import ErrorComponent from '../components/Error/Error.ts';
import bus from '../modules/EventBus.js';

import FormComponent from '../components/Form/Form.js';

import LoaderComponent from '../components/Loader/Loader.ts';
import BackButtonComponent from '../components/BackButton/BackButton.ts';

import GridComponent from '../components/Grid/Grid.ts';
import BaseView2 from './Base2.ts';




export default class EditProfileView extends BaseView2 {
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

        const mainBlock = this._el.querySelector('.container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'casual',
            structure: this.structureView,
        });
        grid.render();

        this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
            href: '/profile',
        });
        menuButton.render();

        if (!this.user && !this.error) {
            this.renderLoading(grid.getItem('content') );
        } else if (this.error) {
            this.renderError(grid.getItem('content') );
            this.error = null;
        } else {
            this.renderForm(grid.getItem('content') );
        }
    }

    renderForm(parent) {
        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Edit',
            name: 'edit',
            multipart: true,
            btn: false,
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

    get structureView() {
        return [
            'mainHeader',
            'backButton',
            'content',
        ];
    }

    get inputs() {
        return [
            {
                name: 'nickname',
                type: 'text',
                placeholder: this.user.nickname,
                value: this.user.nickname,
                className: 'input-block__inputs-item',
            },
            {
                name: 'email',
                type: 'email',
                placeholder: this.user.email,
                value: this.user.email,
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
            },
            {
                name: 'password_repeat',
                type: 'password',
                placeholder: 'Repeat password',
            },
            {
                name: 'avatar',
                type: 'file',
                accept: 'image/jpeg,image/png',
            },
        ];
    }
}
