import Router from './modules/Router.js';
import { rootElement } from './views/ViewsContext.js';
import MenuView from './views/Menu.js';
import LoginView from './views/Login.js';
import LogoutView from './views/Logout.js';
import bus from './modules/EventBus.js';

const startApp = () => {
    const router = new Router(rootElement);
    router
        .register('/', MenuView)
        .register('/login', LoginView)
        .register('/logout', LogoutView);

    router.start();

    bus.on('loggedout', () => {
        router.go('/login');
    });
};

startApp();
