export default class GameController {

    canvas;
    sensitivity;

    keys;
    previous;

    onPress;
    onUp;

    constructor(canvas) {
        this.canvas = canvas;
        this.sensitivity = 0.3;

        this.keys = {};
        this.previous = {};

        this.onPress = this.keyHandler.bind(this, 'press');
        this.onUp = this.keyHandler.bind(this, 'up');

        this.onDeviceMotion = this.onDeviceMotion.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    start() {
        document.addEventListener('keydown', this.onPress);
        document.addEventListener('keyup', this.onUp);

        window.addEventListener('devicemotion', this.onDeviceMotion, true);
        window.addEventListener('touchstart', this.onTouchStart);
        window.addEventListener('touchend', this.onTouchEnd);
    }
    destroy() {
        document.removeEventListener('keydown', this.onPress);
        document.removeEventListener('keyup', this.onUp);
        window.removeEventListener('devicemotion', this.onDeviceMotion, true);
        window.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchend', this.onTouchEnd);
    }

    onTouchStart() {
        this.keys['__touch'] = true;
    }

    onTouchEnd() {
        this.keys['__touch'] = false;
    }

    onDeviceMotion(e) {
        const angleY = e.accelerationIncludingGravity.y;
        const angleX = e.accelerationIncludingGravity.x;
        // e.acceleration

        if (angleX > 0) {
            this.keys['__right_incline'] = angleY > this.sensitivity;
            this.keys['__left_incline'] = angleY < -this.sensitivity;
        } else {
            this.keys['__right_incline'] = angleY < this.sensitivity;
            this.keys['__left_incline'] = angleY > -this.sensitivity;
        }
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
