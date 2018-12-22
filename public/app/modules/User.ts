import bus from 'modules/EventBus';

class User {

    user;
    exist;

    constructor() {
        this.user = null;
        this.exist = false;
        bus.on('get-user-state', this.setUser.bind(this) );
        bus.on('setUserAfterGame', this.setUserAfterGame.bind(this));
        // bus.emit('fetch-user-state');
    }

    setUserAfterGame(data) {
        this.user.record = Math.max(data.record, this.user.record);
        switch(data.result) {
            case 'win':
                this.user.win += 1;
                break;
            case 'draw':
                this.user.draws += 1;
                break;
            case 'lose':
                this.user.loss += 1;
                break;
        }
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
