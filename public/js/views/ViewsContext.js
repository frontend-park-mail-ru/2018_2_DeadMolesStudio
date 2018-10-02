import {noop} from "../modules/Utils";
import {showMenu} from "./Menu.js";
import {ButtonComponent} from "../components/Button/Button";

export const pages = {
    index: showMenu,
    about: showAbout,
    login: showLogin,
    sign_up: showSignUp,
    scoreboard: showScoreboard,
    profile: showProfile,
    play: noop,
};

export const backDomain = 'https://dmstudio-server.now.sh';

export const rootElement = document.querySelector("#root");

export const createBackButton = (el) => {
    const button = new ButtonComponent({
        el: el,
        href: 'index',
        text: "Назад"
    });
    button.on({
        event: "click",
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
    const oldSection = document.querySelector('section');
    const content = document.querySelector('.content');
    if (oldSection) {
        content.removeChild(oldSection);
    }
};
