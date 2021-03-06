import BackButtonComponent from 'components/BackButton/BackButton';
import GridComponent from 'components/Grid/Grid';
import BaseView2 from 'views/Base2';
import FormComponent from 'components/Form/Form.js';
import bus from 'modules/EventBus';


export default class LoginView extends BaseView2 {

    form;
    error;

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
        ];
    }

    get inputs() {
        return [
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
        ];
    }
}
