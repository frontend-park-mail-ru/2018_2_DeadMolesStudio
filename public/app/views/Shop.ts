import BackButtonComponent from 'components/BackButton/BackButton';
import GridComponent from 'components/Grid/Grid';
import BaseView2 from 'views/Base2';
import Shop from 'components/Shop/Shop';
import userState from 'modules/User';
import bus from 'modules/EventBus';
import LoaderComponent from 'components/Loader/Loader';
import ErrorComponent from 'components/Error/Error';

export default class ShopView extends BaseView2 {

    data;
    error;

    constructor(el) {
        super(el);

        this.data = null;
        this.error = null;

        bus.on('shop:get-skins', this.setData.bind(this) );
        bus.on('shop:get-skins-err', this.setError.bind(this) );
        bus.on('shop:buy', this.setFetchBuy.bind(this) );
        bus.on('shop:change', this.setFetchChange.bind(this) );
        bus.on('shop:update-err', this.setError.bind(this) );
    }

    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'user-shop',
            structure: this.structureView,
        });
        grid.render();

        // this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();

        if (!this.data && !this.error) {
            this.renderLoading(grid.getItem('content') );
        } else if (this.error) {
            this.renderError(grid.getItem('content') );
            this.error = null;
        } else {
            this.renderShop(grid.getItem('content') );
        }
    }

    renderShop(parent) {
        const shop = new Shop({
            el: parent,
            user: userState.getUser(),
            data: this.data,
        });
        shop.render();
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    renderError(parent) {
        const errorBlock = new ErrorComponent({
            el: parent,
            error: this.error,
        });

        errorBlock.render();
    }

    setData(data) {
        this.data = data;
        this.render();
    }

    setError(err) {
        this.data = null;
        this.error = err;
        this.render();
    }

    setFetchBuy() {
        this.render();
    }

    setFetchChange() {
        this.render();
    }

    fetchSkins() {
        bus.emit('fetch-skins');
    }

    show() {
        super.show();
        this.fetchSkins();
    }

    get structureView() {
        return [
            'userBlock',
            'mainHeader',
            'backButton',
            'content',
        ];
    }
}
