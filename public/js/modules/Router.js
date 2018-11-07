/*
* @class Router
* @module modules
*/
export default class Router {
    constructor(root) {
        this.root = root;
        this.routes = {};
    }

    /*
    * @param {string} path
    * @param {View} view
    */
    register(path, View) {
        this.routes[path] = {
            View: View,
            view: null,
            el: null,
        };

        return this;
    }

    /*
    * @param {string} path - Путь, по которому собираемся перейти
    */
    go(path) {
        const route = this.routes[path];

        if (!route) {
            this.go('/');
            return;
        }

        if (window.location.pathname !== path) {
            window.history.pushState(null, '', path);
        }

        let { View, view, el } = this.routes[path];

        if (!el) {
            el = document.createElement('section');
            this.root.appendChild(el);
        }

        if (!view) {
            view = new View(el);
        }

        if (!view.isActive) {
            Object.values(this.routes).forEach( ({ view: otherView }) => {
                if (otherView && otherView.isActive) {
                    otherView.hide();
                }
            });

            view.show();
        }

        this.routes[path] = { View, view, el };
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

    start() {
        this.root.addEventListener('click', (event) => {
            // TODO: создать CSS-класс для ссылок, отвечающих за переходы между вью,
            // TODO: и проверять на его наличие, а не просто навешивать на все ссылки
            if (!(event.target instanceof HTMLAnchorElement) ) {
                return;
            }

            event.preventDefault();
            const link = event.target;

            this.go(link.pathname);
        });

        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this.go(currentPath);
        });

        const currentPath = window.location.pathname;
        this.go(currentPath);
    }
}
