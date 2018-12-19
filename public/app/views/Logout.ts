import BaseView from 'views/Base';
import bus from 'modules/EventBus';
import LoaderComponent from 'components/Loader/Loader';
import ErrorComponent from 'components/Error/Error';

export default class LogoutView extends BaseView {

    _el;

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
