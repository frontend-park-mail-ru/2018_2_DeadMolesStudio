import BackButtonComponent from '../components/BackButton/BackButton.ts';
import GridComponent from '../components/Grid/Grid.ts';
import BaseView2 from './Base2.ts';


import FormComponent from '../components/Form/Form.js';


import bus from '../modules/EventBus.js';

export default class SignUpView extends BaseView2 {
    constructor(el) {
        super(el);

        this.form = null;

        this.error = null;
        bus.on('user:signup-err', this.setError.bind(this) );
    }

    setError(err) {
        this.error = err;
        this.form.showErrors(this.error.errors);
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

        this.renderForm(grid.getItem('content') );
        this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();
    }

    fetchSignUp(formData) {
        bus.emit('fetch-signup-user', formData);
    }

    renderForm(parent) {
        const extraBtn = {
            text: 'Login',
            href: '/login',
        };

        this.form = new FormComponent({
            el: parent,
            inputs: this.inputs,
            header: 'SignUp',
            name: 'signup',
            btn: extraBtn,
        });
        this.form.render();

        this.form.on({
            event: 'submit',
            callback: (event) => {
                event.preventDefault();

                this.form.hideErrors();

                const formData = this.form.innerElem.elements;
                this.fetchSignUp(formData);
            },
        });
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
                placeholder: 'Nickname',
            },
            {
                name: 'email',
                type: 'email',
                placeholder: 'Email',
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
        ];
    }
}
