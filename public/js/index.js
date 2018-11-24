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

    bus.on('fetch-user', async () => {
        const data = await UserService.getUser();
        if (data.ok) {
            bus.emit('user:get-profile', data.user);
        } else {
            bus.emit('user:get-profile-err', data.err);
        }
    });

    bus.on('fetch-logout', async () => {
        await SessionService.logout();
        bus.emit('set-user', null);
        bus.emit('loggedout');
    });

    bus.on('fetch-login', async (formData) => {
        const data = await SessionService.login(formData);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('session:login-err', data.err);
        }
    });

    bus.on('fetch-signup-user', async (formData) => {
        const data = await UserService.signup(formData);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('user:signup-err', data.err);
        }
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


    bus.on('fetch-update-user', async ({ formData, user }) => {
        const data = await UserService.update(formData, user);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('user:update-err', data.err);
        }
    });

    router.start();
};

startApp();
