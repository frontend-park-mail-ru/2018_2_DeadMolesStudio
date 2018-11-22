import BaseView from './Base.js';
import backDomain from '../projectSettings.js';

import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import bus from '../modules/EventBus.js';

import LoaderComponent from '../components/Loader/Loader.js';

export default class LogoutView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        this.renderLoading(content);

        this.fetchLogout();
    }

    fetchLogout() {
        bus.emit('fetch-logout');
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    // show() {
    //     this.render();
    // }
}
