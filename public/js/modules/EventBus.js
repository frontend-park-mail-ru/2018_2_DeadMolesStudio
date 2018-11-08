class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(listener => listener !== callback);
        }
        return this;
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(data) );
        }
        return this;
    }
}

export default new EventBus();
