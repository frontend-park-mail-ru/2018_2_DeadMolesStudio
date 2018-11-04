import * as ViewsContext from './ViewsContext.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import BaseView from './Base.js';

const showLogin = () => console.log('ФАЙЛ Logout.js заглушка для showLogin');

export default class LogoutView extends BaseView {
    constructor(el) {
        console.log('LogoutView()');
        super(el);
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');
        const loader = document.createElement('em');
        loader.innerText = 'Loading...';
        content.appendChild(loader);
        // TODO добавить красивое колесико загрузки))
        AjaxFetchModule.doDelete({
            path: '/session',
            domain: ViewsContext.backDomain,
        }).finally( () => {
            loader.hidden = true;
            const login = document.createElement('a');
            login.href = '/login';
            login.innerText = 'Войти';
            content.appendChild(login);
        });
    }
}
