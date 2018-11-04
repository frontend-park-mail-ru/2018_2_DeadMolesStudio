import * as ViewsContext from './ViewsContext.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import BaseView from './Base.js';
import bus from '../modules/EventBus.js';
import LoaderComponent from "../components/Loader/Loader.js";

const showLogin = () => console.log('ФАЙЛ Logout.js заглушка для showLogin');

export default class LogoutView extends BaseView {
    constructor(el) {
        console.log('LogoutView()');
        super(el);
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');
        const loader = new LoaderComponent(content);
        loader.render();
        AjaxFetchModule
            .doDelete({
                path: '/session',
                domain: ViewsContext.backDomain,
            })
            .then( () => {
                bus.emit('loggedout');
            })
            .catch( () => { // TODO: здесь должна быть обработка ошибки (например offline)
                bus.emit('loggedout');
            });
    }
}
