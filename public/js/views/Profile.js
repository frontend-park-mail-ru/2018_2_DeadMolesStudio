import * as ViewsContext from './ViewsContext.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import { showMenu } from './Menu.js';
import { showLogin } from './Login.js';
import Profile from '../components/Profile/Profile.mjs';
import SectionComponent from '../components/Section/Section.mjs';
import ButtonComponent from '../components/Button/Button.mjs';

export const showProfile = () => {
    const content = document.querySelector('.content');
    const profileSection = new SectionComponent({ el: content, name: 'profile' });
    profileSection.render();
    const profileSectionContent = profileSection.sectionContent;

    const em = document.createElement('em');
    em.textContent = 'Loading';
    profileSectionContent.appendChild(em);
    AjaxFetchModule.doGet({
        path: '/profile',
        domain: ViewsContext.backDomain,
    }).then( (response) => {
        profileSectionContent.removeChild(em);
        if (response.status === 200) {
            response.json().then( (data) => {
                const profileData = data;
                console.log(data);
                const profile = new Profile({el: profileSectionContent, data: profileData});
                profile.render();
            });
        } else if (response.status === 401) {
            alert('Надо авторизоваться');
            ViewsContext.hideAnySection();
            showLogin();
        } else {
            alert('Что-то пошло не так.');
            ViewsContext.hideAnySection();
            showMenu();
        }
    });
    const buttonToEditProfile = new ButtonComponent({
        el: profileSectionContent,
        href: 'edit_profile',
        text: 'Настройки',
    });
    buttonToEditProfile.on({
        event: 'click',
        callback: (event) => {
            event.preventDefault();
            const link = event.target;
            ViewsContext.hideAnySection();
            ViewsContext.pages[link.dataset.href]();
        },
    });
    buttonToEditProfile.render();

    const menuButton = ViewsContext.createBackButton(profileSectionContent);
    menuButton.render();
};
