import BackButtonComponent from '../components/BackButton/BackButton.ts';
import GridComponent from '../components/Grid/Grid.ts';
import BaseView2 from './Base2.ts';
import bus from '../modules/EventBus.js';

import Profile from '../components/Profile/Profile.ts';
import ErrorComponent from '../components/Error/Error.ts';
import LoaderComponent from '../components/Loader/Loader.ts';

export default class ProfileView extends BaseView2 {
    constructor(el) {
        super(el);

        this.user = null;
        this.error = null;

        bus.on('user:get-profile', this.setUser.bind(this) );
        bus.on('user:get-profile-err', this.setError.bind(this) );
    }

    show() {
        super.show();
        this.fetchUser();
    }

    hide() {
        super.hide();
        this.user = null;
    }

    fetchUser() {
        bus.emit('fetch-user');
    }

    setUser(user) {
        this.user = user;
        this.render();
    }

    setError(err) {
        this.user = null;
        this.error = err;
        this.render();
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

        this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();

        if (!this.user && !this.error) {
            this.renderLoading(grid.getItem('content') );
        } else if (this.error) {
            this.renderError(grid.getItem('content') );
            this.error = null;
        } else {
            this.renderProfile(grid.getItem('content') );
        }
    }

    get structureView() {
        return [
            'mainHeader',
            'backButton',
            'content',
        ];
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    renderError(parent) {
        let path = '/';
        if (this.error.status === 401) {
            path = '/login';
        }
        const errorBlock = new ErrorComponent({
            el: parent,
            path: path,
            error: this.error.text,
        });

        errorBlock.render();
    }

    renderProfile(parent) {
        const profileData = this.user;
        const profile = new Profile({
            el: parent,
            data: profileData,
        });

        profile.render();
    }
}
