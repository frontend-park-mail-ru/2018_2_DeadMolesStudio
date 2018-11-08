import BaseView from './Base.js';
// import backDomain from '../projectSettings.js';
//
// import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import bus from '../modules/EventBus.js';

import Profile from '../components/Profile/Profile.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';

export default class ProfileView extends BaseView {
    constructor(el) {
        super(el);

        this.user = null;

        bus.on('user:get-profile', this.setUser.bind(this) );
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

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const profileSection = new SectionComponent({ el: content, name: 'profile' });
        profileSection.render();
        const profileSectionContent = profileSection.sectionContent;

        const changingBlock = document.createElement('div');
        profileSectionContent.appendChild(changingBlock);

        if (!this.user) {
            this.renderLoading(changingBlock);
        } else {
            this.renderProfile(changingBlock);
        }

        const menuButton = new ButtonComponent({ el: profileSectionContent });
        menuButton.render();
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
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
            text: 'Изменить',
        });
        editProfileButton.render();
    }
}


// export default class ProfileView extends BaseView {
//     render() {
//         super.render();
//         const content = this._el.querySelector('.content');
//
//         const profileSection = new SectionComponent({ el: content, name: 'profile' });
//         profileSection.render();
//         const profileSectionContent = profileSection.sectionContent;
//
//         const loader = new LoaderComponent(profileSectionContent);
//         loader.render();
//
//         AjaxFetchModule
//             .doGet({
//                 path: '/profile',
//                 domain: backDomain,
//             })
//             .then( (response) => {
//                 loader.hide();
//                 if (response.status === 200) {
//                     response.json()
//                         .then( (data) => {
//                             const profileData = data;
//                             const profile = new Profile({
//                                 el: profileSectionContent,
//                                 data: profileData,
//                             });
//                             profile.render();
//                         });
//                 } else if (response.status === 401) {
//                     alert('Надо авторизоваться');
//                     bus.emit('tologin');
//                 } else {
//                     alert('Что-то пошло не так.');
//                     bus.emit('showmenu');
//                 }
//             })
//             .catch( () => {
//                 alert('Что-то пошло не так.');
//                 bus.emit('showmenu');
//             });
//
//         const editProfileButton = new ButtonComponent({
//             el: profileSectionContent,
//             href: '/profile/settings',
//             text: 'Изменить',
//         });
//         editProfileButton.render();
//
//         const menuButton = new ButtonComponent({ el: profileSectionContent });
//         menuButton.render();
//     }
// }
