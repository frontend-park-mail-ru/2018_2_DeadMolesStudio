import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import bus from '../modules/EventBus.js';

import LoaderComponent from '../components/Loader/Loader.js';

export default class LogoutView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');
        const loader = new LoaderComponent(content);
        loader.render();
        AjaxFetchModule
            .doDelete({
                path: '/session',
                domain: backDomain,
            })
            .then( () => {
                bus.emit('loggedout');
            })
            .catch( () => {
                alert('Сейчас нельзя выйти.');
                bus.emit('showmenu');
            });
    }
}
