import Router from './modules/Router.js';
import bus from './modules/EventBus.js';
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
        .register('/play', GameView);

    router.start();

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
                console.log('in fetch-user', err);
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
};

startApp();
