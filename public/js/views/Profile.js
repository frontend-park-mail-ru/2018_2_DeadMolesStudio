import BaseView from './Base.js';
import bus from '../modules/EventBus.js';

import Profile from '../components/Profile/Profile.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import ErrorComponent from '../components/Error/Error.mjs';
import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';

export default class ProfileView extends BaseView {
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

    fetchUser() {
        bus.emit('fetch-user');
    }

    setUser(user) {
        this.user = user;
        this.render();
    }

    setError(err) {
        this.error = err;
        this.render();
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const profileSection = new SectionComponent({ el: content, name: 'profile' });
        profileSection.render();
        const profileSectionContent = profileSection.sectionContent;

        const changingBlock = document.createElement('div');
        profileSectionContent.appendChild(changingBlock);

        const menuButton = new ButtonComponent({ el: profileSectionContent });
        menuButton.render();

        if (!this.user && !this.error) {
            this.renderLoading(changingBlock);
        } else if (this.error) {
            this.renderError(profileSectionContent);
            this.error = null;
        } else {
            this.renderProfile(changingBlock);
        }
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

        const editProfileButton = new ButtonComponent({
            el: parent,
            href: '/profile/settings',
            text: 'Редактировать',
        });
        editProfileButton.render();
    }
}
