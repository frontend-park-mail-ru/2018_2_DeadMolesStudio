import ButtonComponent from '../components/Button/Button.ts';
import GridComponent from '../components/Grid/Grid.ts';
import BaseView2 from './Base2.ts';

// import SectionComponent from '../components/Section/Section.ts';
import FormComponent from '../components/Form/Form.js';

import bus from '../modules/EventBus.js';

export default class LoginView extends BaseView2 {
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
        const mainBlock = this._el.querySelector('.container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'login',
            structure: this.structureView,
        });
        grid.render();

        this.renderForm(grid.getItem('content') );
        this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new ButtonComponent({ el: grid.getItem('backButton') });
        menuButton.render();
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

    get structureView() {
        return [
            'mainHeader',
            'backButton',
            'content',
            'chat',
        ];
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
