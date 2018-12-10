import BaseView from './Base.ts';

import SectionComponent from '../components/Section/Section.ts';
import FormComponent from '../components/Form/Form.js';
import LinkComponent from '../components/Link/Link.ts';

import bus from '../modules/EventBus.js';

export default class LoginView extends BaseView {
    constructor(el) {
        super(el);

        this.form = null;

        this.error = null;
        bus.on('session:login-err', this.setError.bind(this) );
    }

    setError(err) {
        this.error = err;
        this.form.showErrors(this.error.errors);
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const loginSection = new SectionComponent({ el: content, name: 'login' });
        loginSection.render();
        const loginSectionContent = loginSection.sectionContent;

        this.renderForm(loginSectionContent);

        // const signUpLink = new LinkComponent({
        //     el: loginSectionContent,
        //     text: 'Регистрация',
        //     href: '/signup',
        //     className: 'input-block__btn-extra',
        // });
        // signUpLink.render();
    }

    fetchLogin(formData) {
        bus.emit('fetch-login', formData);
    }

    renderForm(parent) {
        const extraBtn = {
            text: 'SignUp',
            href: '/signup',
        };

        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'Login',
            name: 'login',
            btn: extraBtn,
        });

        this.form.render();

        this.form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                this.form.hideErrors();

                const formData = this.form.innerElem.elements;
                this.fetchLogin(formData);
            },
        });
    }

    get inputs() {
        return [
            {
                name: 'email',
                type: 'email',
                placeholder: 'Email',
                className: 'input-block__inputs-item',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Password',
                className: 'input-block__inputs-item',
            },
        ];
    }
}
