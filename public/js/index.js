'use strict';

import {ButtonComponent} from "./components/Button/Button.mjs";
import {MenuComponent} from "./components/Menu/Menu.mjs";
import {SectionComponent} from "./components/Section/Section.mjs";
import {LinkComponent} from "./components/Link/Link.mjs";
import {FormComponent} from "./components/Form/Form.mjs";

import {noop} from "./modules/Utils.mjs";
const AJAX = window.AjaxModule; //AJAX.ajax(...);


const root = document.querySelector("#root");

const createBackButton = (el) => {
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
            replaceSection();
            pages[ link.dataset.href ]();
        },
    });
    return button;
};

const replaceSection = (newSection = null) => {
    const content = document.querySelector(".content");
    const oldSection = document.querySelector("section");
    if (newSection) {
        content.replaceChild(newSection, oldSection);
    } else {
        content.removeChild(oldSection);
    }
};

const createGameTitle = () => {
    const gameTitle = document.querySelector('.game_title');
    const h1 = document.createElement('h1');

    const gameTitleLink = new LinkComponent({
        el: h1,
        text: "Abstract Ketnipz ((",
        href: 'index',
        className: "game_title__link",
    });
    gameTitleLink.on({
        event: "click",
        callback: event => {
            debugger;
            console.log(`linkTarget: ${event.target}`);
            event.preventDefault();
            const link = event.target;
            replaceSection();
            pages[ link.dataset.href ]();
        },
    });

    gameTitle.appendChild(h1);

    gameTitleLink.render();
};

const showBase = () => {
    root.innerHTML = `
        <div class="container">
            <div class="content">
                <div class="game_title">
                </div>
            </div>
        </div>
    `.trim();
};

const showMenu = () => {
    const content = document.querySelector(".content");

    const menuSection = new SectionComponent({el: content, name: 'index'});
    menuSection.render();


    const titles = {
        index: "Играть!",
        profile: "Профиль",
        scoreboard: "Списки лидеров",
        about: "Об игре",
        login: "Выход"
    };

    const menu = new MenuComponent({
        el: menuSection.sectionContent,
        titles: titles,
        actionOnButton: (event) => {
            event.preventDefault();
            const link = event.target;
            replaceSection();
            pages[ link.dataset.href ]();
        }
    });

    menu.render();
};

const showLogin = () => {
    const content = document.querySelector(".content");

    const loginSection = new SectionComponent({el: content, name: 'login'});
    loginSection.render();

    const inputs = [
        {
            name: "email",
            type: "email",
            placeholder: "Почта",
            className: "bordered_input"
        },
        {
            name: "password",
            type: "password",
            placeholder: "Пароль",
            className: "bordered_input"
        },
        {
            name: "submit",
            type: "submit",
            className: "cute-btn",
            value: 'Войти'
        }
    ];

    const form = new FormComponent({
        el: loginSection.sectionContent,
        inputs: inputs,
        header: 'Войти!',
        name: 'login',
    });

    form.render();

    form.on({
        event: 'submit',
        callback: event => {
            event.preventDefault();

            const formData = form.innerElem.elements;
            const email = formData['email'];
            const password = formData['password'];

            AJAX.doPost({
                path: '/login',
                domain: '',//наш бек на го
                callback: (xhr) => {
                    if ( xhr.status === 200 ) {
                        replaceSection();
                        showProfile();
                    } else if ( xhr.status === 400 ) {
                        console.log('JSON is wrong');
                        replaceSection();
                        showSignUp();
                    } else if ( xhr.status === 422 ) {
                        const errors = [{
                            text: 'Неверная пара почта/пароль'
                        }];
                    }
                },
                body: {
                    email: email,
                    password: password,
                },
            });

        },
    });

    const signUpLink = new LinkComponent({
        el: loginSection.sectionContent,
        text: "Зарегистрироваться",
        href: 'sign_up',
        className: "sub_link",
    });
    signUpLink.on({
        event: "click",
        callback: event => {
            console.log(`linkTarget: ${event.target}`);
            event.preventDefault();
            const link = event.target;
            replaceSection();
            pages[ link.dataset.href ]();
        },
    });

    signUpLink.render();

};

const showSignUp = () => {
    const content = document.querySelector(".content");

    const signupSection = new SectionComponent({el: content, name: 'signup'});
    signupSection.render();

    const inputs = [
        {
            name: "nickname",
            type: "text",
            placeholder: "Логин",
            className: "bordered_input"
        },
        {
            name: "email",
            type: "email",
            placeholder: "Email",
            className: "bordered_input"
        },
        {
            name: "password",
            type: "password",
            placeholder: "Пароль",
            className: "bordered_input"
        },
        {
            name: "password_repeat",
            type: "password",
            placeholder: "Повторите пароль",
            className: "bordered_input"
        },
        {
            name: "submit",
            type: "submit",
            className: "cute-btn",
            value: 'Зарегистрироваться'
        }
    ];

    const form = new FormComponent({
        el: signupSection.sectionContent,
        inputs: inputs,
        header: 'Зарегистрироваться!',
        name: 'signup',
    });

    form.render();

    form.on({
        event: 'submit',
        callback: event => {
            event.preventDefault();

            const formData = form.innerElem.elements;
            const email = formData['email'];
            const nickname = formData['nickname'];
            const password = formData['password'];
            const passwordRepeat = formData['password_repeat'];

            if ( password !== passwordRepeat ) {
                alert('Passwords is not equals');
                return;
            }

            AJAX.doPost({
                path: '/profile',
                domain: '',//наш бек на го
                callback: (xhr) => {
                    if ( xhr.status === 200 ) {
                        replaceSection();
                        showProfile();
                    } else if ( xhr.status === 400 ) {
                        console.log('JSON is wrong');
                        replaceSection();
                        showSignUp();
                    } else if ( xhr.status === 403 ) {
                        const errors = JSON.parse(xhr.responseText);
                        const errorList = errors['error'];
                        form.showErrors(errorList);
                    }
                },
                body: {
                    email: email,
                    nickname: nickname,
                    password: password,
                },
            });

        },
    });

    const loginLink = new LinkComponent({
        el: signupSection.sectionContent,
        text: "У меня уже есть аккаунт",
        href: 'login',
        className: "sub_link",
    });
    loginLink.on({
        event: "click",
        callback: event => {
            console.log(`linkTarget: ${event.target}`);
            event.preventDefault();
            const link = event.target;
            replaceSection();
            pages[ link.dataset.href ]();
        },
    });

    loginLink.render();
};

const showScoreboard = (users) => {
    const scoreboardSection = document.createElement("section");
    scoreboardSection.className = "scoreboard_page";
    scoreboardSection.dataset.sectionName = 'scoreboard';

    const scoreboardBlock = document.createElement("div");
    scoreboardBlock.className = "scoreboard__main";

    const header = document.createElement("h2");
    header.textContent = "Scoreboard";

    scoreboardBlock.appendChild(header);

    if (users) {
        const scoreboard = document.createElement("div");
        scoreboard.className = "scoreboard";

        const scoreboardList = document.createElement("ol");
        const scoreboardHead = document.createElement("span");
        scoreboardHead.className = "scoreboard_head";

        const scoreboardPos = document.createElement("span");
        scoreboardPos.className = "scoreboard_node__position";
        scoreboardPos.textContent = "#";

        const scoreboardName = document.createElement("span");
        scoreboardName.className = "scoreboard_node__name";
        scoreboardName.textContent = "Игрок";

        const scoreboardScores = document.createElement("span");
        scoreboardScores.className = "scoreboard_node__scores";
        scoreboardScores.textContent = "Очки";

        scoreboardHead.appendChild(scoreboardPos);
        scoreboardHead.appendChild(scoreboardName);
        scoreboardHead.appendChild(scoreboardScores);

        const scoreboardNodes = document.createElement("div");
        scoreboardNodes.className = "scoreboard_list scrolable";


        users.forEach( (user) => {
            const {position, login, scores} = user;

            const node = document.createElement("li");
            node.className = "scoreboard_node";

            const nodePos = document.createElement("span");
            nodePos.className = "scoreboard_node__position";
            nodePos.textContent = position;

            const nodeName = document.createElement("span");
            nodeName.className = "scoreboard_node__name";
            nodeName.textContent = login;

            const nodeScores = document.createElement("span");
            nodeScores.className = "scoreboard_node__scores";
            nodeScores.textContent = scores;

            node.appendChild(nodePos);
            node.appendChild(nodeName);
            node.appendChild(nodeScores);

            scoreboardNodes.appendChild(node);
        });

        scoreboardList.appendChild(scoreboardHead);
        scoreboardList.appendChild(scoreboardNodes);
        scoreboard.appendChild(scoreboardList);
        scoreboardBlock.appendChild(scoreboard);

    } else {
        const em = document.createElement('em');
        em.textContent = 'Loading';
        scoreboardBlock.appendChild(em);

        AJAX.doGet({
            path: "/users",
            callback: (xhr) => {
                const users = JSON.parse(xhr.responseText);
                replaceSection();
                showScoreboard(users);
            },

        });
    }

    const menuButton = createBackButton(scoreboardBlock);
    menuButton.render();

    const content = document.querySelector(".content");
    content.appendChild(scoreboardSection);
};

const showAbout = () => {
    const aboutSection = document.createElement("section");
    aboutSection.dataset.sectionName = 'about';
    aboutSection.className = "about_page";

    const aboutBlock = document.createElement("div");
    aboutBlock.className = "about__main";

    const rulesBlock = document.createElement("div");
    rulesBlock.className = "rules";

    const header = document.createElement("h2");
    header.textContent = "Как играть?";
    
    const rules = [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo accusamus magni ut numquam illum dolorem eum asperiores repellat eligendi iste magnam dolore dicta optio necessitatibus veniam, laborum minus, quasi impedit! ",
        "Nisi tempora explicabo iusto nihil libero corporis ad error quam maxime doloribus ducimus possimus inventore necessitatibus temporibus tempore quidem, ea officiis quia architecto vero laboriosam, sint rem pariatur quaerat fuga? Tempora a quia nobis voluptatibus error ex, magni accusantium voluptate perferendis. Iste alias architecto harum nulla non labore rerum qui, tempore possimus id aperiam cumque ullam unde voluptate fugit odio molestiae at repudiandae minus aliquam deserunt earum maiores reiciendis. Voluptates!",
    ];


    aboutSection.appendChild(aboutBlock);
    aboutBlock.appendChild(rulesBlock);
    rulesBlock.appendChild(header);
    rules.forEach((rule) => {
        let ruleP = document.createElement("p");
        ruleP.textContent = rule;
        rulesBlock.appendChild(ruleP);
    });
    const menuButton = createBackButton(rulesBlock);
    menuButton.render();

    const content = document.querySelector(".content");
    content.appendChild(aboutSection);
};

const showProfile = (profile) => {
    const profileSection = document.createElement("section");
    profileSection.dataset.sectionName = 'about';
    profileSection.className = "profile_page";

    const profileBlock = document.createElement("div");
    profileBlock.className = "profile__main";

    const header = document.createElement("h2");
    header.textContent = "Профиль";

    profileSection.appendChild(profileBlock);
    profileBlock.appendChild(header);

    if (profile) {
        const { nickname, record, win, draws, loss } = profile;
        const profileInfo = {
            "Никнейм: ": nickname,
            "Рекорд: ": record,
            "Побед: ": win,
            "Ничьих: ": draws,
            "Поражений: ": loss,
            "Винрейт: ": ((win / (loss + win)) * 100).toFixed(2).toString() + "%",
        };
        
        for (let key in profileInfo) {
            const itemBlock = document.createElement("div");
            const itemName = document.createElement("b");
            itemName.textContent = key;
            const itemValue = document.createElement("span");
            itemValue.textContent = profileInfo[key];

            itemBlock.appendChild(itemName);
            itemBlock.appendChild(itemValue);
            profileBlock.appendChild(itemBlock);
        }
    } else {
        const em = document.createElement('em');
        em.textContent = 'Loading';
        profileBlock.appendChild(em);
        
        AJAX.doGet({
            path: "/profile",
            callback: (xhr) => {
                const profile = JSON.parse(xhr.responseText);
                replaceSection();
                showProfile(profile);
            },

        });

    }

    const menuButton = createBackButton(profileBlock);
    menuButton.render();
    const content = document.querySelector(".content");
    content.appendChild(profileSection);
};

const pages = {
    index: showMenu,
    about: showAbout,
    login: showLogin,
    sign_up: showSignUp,
    scoreboard: showScoreboard,
    profile: showProfile,
    play: noop,
};

const startApp = () => {
    showBase();
    showMenu();
    createGameTitle();
};

startApp();



