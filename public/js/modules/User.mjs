import bus from './EventBus.js';

class User {
    constructor() {
        this.user = null;
        bus.on('get-user-state', this.setUser.bind(this) );
        bus.emit('fetch-user-state');
    }

    isAuth() {
        return this.user !== null;
    }

    deleteUser() {
        this.user = null;
    }

    setUser(data) {
        this.user = data;
    }

    getUser() {
        return this.user;
    }
}

export default new User();
