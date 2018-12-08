import BaseView from './Base.ts';
import bus from '../modules/EventBus.js';
import LoaderComponent from '../components/Loader/Loader.ts';
import ErrorComponent from '../components/Error/Error.ts';

export default class LogoutView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        if (navigator.onLine) {
            this.renderLoading(content);
        } else {
            this.renderError(content);
        }


        this.fetchLogout();
    }

    fetchLogout() {
        bus.emit('fetch-logout');
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    renderError(parent) {
        const errorBlock = new ErrorComponent({
            el: parent,
            error: 'Сейчас нельзя выйти!',
        });

        errorBlock.render();
    }
}
