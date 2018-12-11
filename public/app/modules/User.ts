import bus from './EventBus';

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

    getNickname() {
        return this.isAuth() ? this.user.nickname : 'Me'
    }
}

export default new User();
