import * as ViewsContext from "./ViewsContext.js";
import {AjaxFetchModule} from "../modules/AjaxFetch.mjs";
import {showMenu} from "./Menu.js";
import {showLogin} from "./Login.js";

export const showProfile = profile => {
    const profileSection = document.createElement('section');
    profileSection.dataset.sectionName = 'about';
    profileSection.className = 'profile_page';

    const profileBlock = document.createElement("div");
    profileBlock.className = 'profile__main';

    const header = document.createElement('h2');
    header.textContent = 'Профиль';

    profileSection.appendChild(profileBlock);
    profileBlock.appendChild(header);

    if (profile) {
        const { nickname, email, record, win, draws, loss } = profile;
        const profileInfo = {
            'Никнейм: ': nickname,
            'Почта: ': email,
            'Рекорд: ': record,
            'Побед: ': win,
            'Ничьих: ': draws,
            'Поражений: ': loss,
            'Винрейт: ': (loss + win === 0 ? 0 : ((win / (loss + win)) * 100).toFixed(2).toString() ) + '%',
        };

        for (let key in profileInfo) {
            const itemBlock = document.createElement('div');
            const itemName = document.createElement('b');
            itemName.textContent = key;
            const itemValue = document.createElement('span');
            itemValue.textContent = profileInfo[key];

            itemBlock.appendChild(itemName);
            itemBlock.appendChild(itemValue);
            profileBlock.appendChild(itemBlock);
        }
    } else {
        const em = document.createElement('em');
        em.textContent = 'Loading';
        profileBlock.appendChild(em);

        AjaxFetchModule.doGet({
            path: '/profile',
            domain: ViewsContext.backDomain,
        }).then( (response) => {
            if ( response.status === 200 ) {
                response.json().then( (data) => {
                   console.log(data);
                    const profile = data;
                    ViewsContext.hideAnySection();
                    showProfile(profile);
                });
            } else if ( response.status === 401 ) {
                alert('Надо авторизоваться');
                ViewsContext.hideAnySection();
                showLogin();
            } else {
                alert('Что-то пошло не так.');
                ViewsContext.hideAnySection();
                showMenu();
            }
        });
    }

    const menuButton = ViewsContext.createBackButton(profileBlock);
    menuButton.render();
    const content = document.querySelector('.content');
    content.appendChild(profileSection);
};