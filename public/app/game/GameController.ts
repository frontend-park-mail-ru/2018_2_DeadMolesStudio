export default class GameController {

    canvas;
    sensitivity;

    keys;
    previous;

    onPress;
    onUp;

    constructor(canvas) {
        this.canvas = canvas;
        this.sensitivity = 1;

        this.keys = {};
        this.previous = {};

        this.onPress = this.keyHandler.bind(this, 'press');
        this.onUp = this.keyHandler.bind(this, 'up');
    }

    start() {
        document.addEventListener('keydown', this.onPress);
        document.addEventListener('keyup', this.onUp);

        window.addEventListener('devicemotion', this.onDeviceMotion.bind(this), true);
        window.addEventListener('touchstart', this.onTouchStart.bind(this) );
        window.addEventListener('touchend', this.onTouchEnd.bind(this) );
    }
    destroy() {
        document.removeEventListener('keydown', this.onPress);
        document.removeEventListener('keyup', this.onUp);
        window.removeEventListener('devicemotion', this.onDeviceMotion.bind(this), true);
        window.removeEventListener('touchstart', this.onTouchStart.bind(this) );
        window.removeEventListener('touchend', this.onTouchEnd.bind(this) );
    }

    onTouchStart() {
        this.keys['__touch'] = true;
    }

    onTouchEnd() {
        this.keys['__touch'] = false;
    }

    onDeviceMotion(e) {
        // e.acceleration
        const angleY = e.accelerationIncludingGravity.y;
        this.keys['__right_incline'] = angleY > this.sensitivity;
        this.keys['__left_incline'] = angleY < -this.sensitivity;
    }

    // нажата ли клавиша
    isPressed(key) {
        return this.keys[key];
    }

    //
    /*
    * Перезаписывает состояние клавиши
    * @param {string} type - одно из двух 'press' или 'up'
    * @param {MouseEvent} event
    * */
    keyHandler(type, event) {
        this.keys[event.key.toLowerCase()] = type === 'press';
    }

    diff() {
        let allKeys = [];
        allKeys.push(...Object.keys(this.previous) );
        allKeys.push(...Object.keys(this.keys) );
        allKeys = allKeys.map( key => key.toLowerCase() );
        allKeys = allKeys.filter( (key, pos, all) => {
            return all.indexOf(key, pos + 1) === -1; // кикаем дубликаты
        });
        const clicked = allKeys.reduce( (res, key) => {
            // либо нажали либо не отпускали с прошлого вызова
            res[key] = this.keys[key];
            // res[key] = !this.previous[key] && this.keys[key];
            return res;
        }, {});

        // this.previous = Object.assign({}, this.keys);
        this.previous = { ...this.keys };
        return clicked;
    }
}
