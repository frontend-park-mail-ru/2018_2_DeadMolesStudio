import {noop} from "../modules/Utils.mjs";
import {showMenu} from "./Menu.js";
import {showAbout} from "./About.js";
import {showLogin} from "./Login.js";
import {showSignUp} from "./SignUp.js";
import {showScoreboard} from "./Scoreboard.js";
import {showProfile} from "./Profile.js";
import {doLogout} from "./Logout.js";
import {showEditProfile} from "./EditProfile.js";

import {ButtonComponent} from "../components/Button/Button.mjs";


export const pages = {
        index: showMenu,
        about: showAbout,
        login: showLogin,
        sign_up: showSignUp,
        scoreboard: showScoreboard,
        profile: showProfile,
        play: noop,
        logout: doLogout,
        edit_profile: showEditProfile
};

export const backDomain = 'https://dmstudio-server.now.sh';

export const rootElement = document.querySelector('#root');

export const createBackButton = (el) => {
    const button = new ButtonComponent({
        el: el,
        href: 'index',
        text: 'Назад'
    });
    button.on({
        event: 'click',
        callback: (event) => {
            event.preventDefault();
            const link = event.target;
            hideAnySection();
            pages[ link.dataset.href ]();
        },
    });
    return button;
};

export const hideAnySection = () => {
    const oldSections = document.querySelectorAll('section');
    const content = document.querySelector('.content');
    oldSections.forEach( section => content.removeChild(section));
};
