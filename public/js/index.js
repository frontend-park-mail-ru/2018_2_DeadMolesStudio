import Router from './modules/Router.js';
import bus from './modules/EventBus.js';
import ScoreboardService from './Services/ScoreboardService.js';
import SessionService from './Services/SessionService.js';
import UserService from './Services/UserService.js';
import ScoreboardView from './views/Scoreboard.js';

import MenuView from './views/Menu.js';
import LoginView from './views/Login.js';
import LogoutView from './views/Logout.js';
import AboutView from './views/About.js';
import ProfileView from './views/Profile.js';
import EditProfileView from './views/EditProfile.js';
import SignUpView from './views/SignUp.js';
import GameView from './views/GameView.js';
import PreGameView from './views/PreGame.js';

const startApp = () => {
    const rootElement = document.querySelector('#root');
    const router = new Router(rootElement);
    router
        .register('/', MenuView)
        .register('/login', LoginView)
        .register('/logout', LogoutView)
        .register('/about', AboutView)
        .register('/profile', ProfileView)
        .register('/profile/settings', EditProfileView)
        .register('/signup', SignUpView)
        .register('/scoreboard', ScoreboardView)
        .register('/play', GameView)
        .register('/pregame', PreGameView);

    bus.on('loggedout', () => {
        router.go('/login');
    });

    bus.on('tologin', () => {
        router.go('/login');
    });

    bus.on('tosignup', () => {
        router.go('/signup');
    });

    bus.on('showmenu', () => {
        router.go('/');
    });

    bus.on('editprofile', () => {
        router.go('/profile/settings');
    });

    bus.on('showprofile', () => {
        router.go('/profile');
    });

    bus.on('fetch-user', () => {
        UserService.FetchUser()
            .then( (user) => {
                bus.emit('user:get-profile', user);
            })
            .catch( (err) => {
                if (err === 401) {
                    alert('Надо авторизоваться');
                    bus.emit('tologin');
                } else if (err.Name === 'TypeError: Failed to fetch') {
                    console.log('failed to fetch user', err);
                } else {
                    alert('Что-то пошло не так!');
                    bus.emit('showmenu');
                }
            });
    });

    bus.on('fetch-scoreboard', () => {
        ScoreboardService.FetchScoreboard()
            .then( (data) => {
                bus.emit('scoreboard:get-data', data);
            })
            .catch( () => {
                alert('Что-то пошло не так.');
                bus.emit('showmenu');
            });
    });

    bus.on('fetch-page-scoreboard', ({ limit, page }) => {
        ScoreboardService.FetchPageScoreboard(limit, page)
            .then( (data) => {
                bus.emit('scoreboard:get-page', data);
            })
            .catch( () => {
                alert('Что-то пошло не так.');
                bus.emit('showmenu');
            });
    });

    bus.on('fetch-logout', () => {
        SessionService.FetchLogout()
            .then( () => {
                bus.emit('loggedout');
            })
            .catch( () => {
                alert('Сейчас нельзя выйти.');
                bus.emit('showmenu');
            });
    });

    bus.on('fetch-update-user', ({ req, form }) => {
        UserService.FetchUpdateUpUser(req)
            .then( () => {
                bus.emit('showprofile');
            })
            .catch( (response) => {
                const { status } = response;
                switch (status) {
                case 400:
                    bus.emit('showprofile');
                    break;
                case 401:
                    alert('Надо авторизоваться');
                    bus.emit('tologin');
                    break;
                case 403:
                    response.json()
                        .then( (data) => {
                            const errorList = data.error;
                            form.showErrors(errorList);
                        });
                    break;
                default:
                    alert('Что-то пошло не так!');
                    bus.emit('showmenu');
                }
            });
    });

    bus.on('fetch-login', ({ req, form }) => {
        SessionService.FetchLogin(req)
            .then( () => {
                bus.emit('showprofile');
            })
            .catch( (status) => {
                const errors = [];
                switch (status) {
                case 400:
                    alert('Что-то пошло не так, лучше зарегистрируйтесь!');
                    bus.emit('tosignup');
                    break;
                case 422:
                    errors.push({
                        text: 'Неверная пара почта/пароль',
                    });
                    form.showErrors(errors);
                    break;
                default:
                    alert('Что-то пошло не так');
                    bus.emit('showmenu');
                    break;
                }
            });
    });

    bus.on('fetch-signup-user', ({ req, form }) => {
        UserService.FetchSignUpUser(req)
            .then( () => {
                bus.emit('showprofile');
            })
            .catch( (response) => {
                const { status } = response;
                response.json()
                    .then( (body) => {
                        let { error: errors } = body;
                        if (!errors) errors = [];
                        form.hideErrors();
                        switch (status) {
                        case 400:
                            errors.push({
                                text: 'Что-то пошло не так! Попробуйте позже!',
                            });
                            form.showErrors(errors);
                            break;
                        case 403:
                            form.showErrors(errors);
                            break;
                        case 422:
                            errors.push({
                                text: 'Заполните все поля!',
                            });
                            form.showErrors(errors);
                            break;
                        default:
                            errors.push({
                                text: 'Что-то пошло не так!',
                            });
                            form.showErrors(errors);
                            break;
                        }
                    });
            });
    });

    router.start();
};

startApp();
