'use strict';

import {ButtonComponent} from "./components/Button/Button.js";

const root = document.querySelector("#root");

const AJAX = window.AjaxModule; //AJAX.ajax(...);

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
        }
    });
    return button;
};

const showBase = () => {
    const mainContainer = document.createElement("div");
    mainContainer.className = "container";

    const content = document.createElement("div");
    content.className = "content";

    const gameTitleBlock = document.createElement("div");
    gameTitleBlock.className = "game_title";
    const gameTitle = document.createElement("h1");
    const gameTitleLink = document.createElement("a");
    gameTitleLink.className = "game_title__link nav_link";
    gameTitleLink.href = gameTitleLink.dataset.href = "index";
    gameTitleLink.textContent = "Abstract Ketnipz";

    gameTitle.appendChild(gameTitleLink);
    gameTitleBlock.appendChild(gameTitle);

    content.appendChild(gameTitleBlock);
    mainContainer.appendChild(content);

    root.appendChild(mainContainer);
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

const showMenu = () => {
    const menuSection = document.createElement("section");
    menuSection.dataset.sectionName = 'menu';
    menuSection.className = "index_page";
    const menuBlock = document.createElement("index__main");
    menuBlock.className = "index__main";
    const menu = document.createElement("div");
    menu.className = "menu";

    const titles = {
        index: "Играть!",
        profile: "Профиль",
        scoreboard: "Списки лидеров",
        about: "Об игре",
        login: "Выход"
    };

    Object.entries(titles).forEach( (entry) => {
        const href = entry[0];
        const title = entry[1];

        const button = new ButtonComponent({
            el: menu,
            href: href,
            text: title
        });

        button.on({
            event: "click",
            callback: (event) => {
                event.preventDefault();
                const link = event.target;

                console.log({
                    href: link.href,
                    dataHref: link.dataset.href
                });

                replaceSection();
                pages[ link.dataset.href ]();
            }
        });
        button.render();
    });

    menuBlock.appendChild(menu);
    menuSection.appendChild(menuBlock);

    const content = document.querySelector(".content");
    content.appendChild(menuSection);
};

const showLogin = () => {
    const loginSection = document.createElement("section");
    loginSection.dataset.sectionName = 'login';
    loginSection.className = "login_page";

    const loginBlock = document.createElement("div");
    loginBlock.className = "login__main";

    const header =  document.createElement("h2");
    header.textContent =  "Войти";

    const form = document.createElement('form');
    form.className = "login_form";

    const inputs = [
        {
            name: "login",
            type: "text",
            placeholder: "Логин",
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
            className: "cute-btn"
        }
    ];

    inputs.forEach( (item) => {
        const input = document.createElement("input");

        input.className = item.className;

        input.name = item.name;
        input.type = item.type;
        input.placeholder = item.placeholder;

        form.appendChild(input);
    });

    // const loginButton = form.getElementsByName("submit")[0];
    // loginButton.value = "Войти";

    const signUpLink = document.createElement("a");
    signUpLink.className = "sub_link";
    signUpLink.href = signUpLink.dataset.href = "sign_up";
    signUpLink.innerHTML = "<span class='inner nav_link'>Зарегистрироваться</span>";

    loginBlock.appendChild(header);
    loginBlock.appendChild(form);
    loginBlock.appendChild(signUpLink);

    loginSection.appendChild(loginBlock);

    const content = document.querySelector(".content");
    content.appendChild(loginSection);
};

const showSignUp = () => {
    const signupSection = document.createElement("section");
    signupSection.dataset.sectionName = 'signup';
    signupSection.className = "signup_page";

    const signupBlock = document.createElement("div");
    signupBlock.className = "login__main";

    const header =  document.createElement("h2");
    header.textContent =  "Зарегистрироваться";

    const form = document.createElement('form');
    form.className = "login_form";

    const inputs = [
        {
            name: "login",
            type: "text",
            placeholder: "Логин",
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
            className: "cute-btn"
        }
    ];

    inputs.forEach( (item) => {
        const input = document.createElement("input");

        input.className = item.className;

        input.name = item.name;
        input.type = item.type;
        input.placeholder = item.placeholder;

        form.appendChild(input);
    });

    // const loginButton = form.getElementsByName("submit")[0];
    // loginButton.value = "Войти";

    const loginLink = document.createElement("a");
    loginLink.className = "sub_link";
    loginLink.href = loginLink.dataset.href = "sign_up";
    loginLink.innerHTML = "<span class='inner nav_link'>У меня уже есть аккаунт</span>";

    signupBlock.appendChild(header);
    signupBlock.appendChild(form);
    signupBlock.appendChild(loginLink);

    signupSection.appendChild(signupBlock);

    const content = document.querySelector(".content");
    content.appendChild(signupSection);
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

    const menuButton = createMenuLink();
    
    aboutSection.appendChild(aboutBlock);
    aboutBlock.appendChild(rulesBlock);
    rulesBlock.appendChild(header);
    rules.forEach((rule) => {
        let ruleP = document.createElement("p");
        ruleP.textContent = rule;
        rulesBlock.appendChild(ruleP);
    });
    rulesBlock.appendChild(menuButton);

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

    const menuButton = createMenuLink();
    profileBlock.appendChild(menuButton);
    
    const content = document.querySelector(".content");
    content.appendChild(profileSection);
};

showBase();
showMenu();

const pages = {
    index: showMenu,
    about: showAbout,
    login: showLogin,
    sign_up: showSignUp,
    scoreboard: showScoreboard,
    profile: showProfile,
};
