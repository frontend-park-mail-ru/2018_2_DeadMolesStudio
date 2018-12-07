import bus from './EventBus.js';

class User {

    user;
    exist;

    constructor() {
        this.user = null;
        this.exist = false;
        bus.on('get-user-state', this.setUser.bind(this) );
        // bus.emit('fetch-user-state');
    }

    isAuth() {
        return this.user !== null;
    }

    isExist() {
        return this.exist;
    }

    deleteUser() {
        this.user = null;
    }

    setUser(data) {
        this.user = data;
        this.exist = true;
        bus.emit('user-state-set');
    }

    getUser() {
        return this.user;
    }
}

export default new User();
