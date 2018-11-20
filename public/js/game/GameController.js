export default class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.previous = {};
        this.keys = {};

        this.onPress = this.keyHandler.bind(this, 'press');
        this.onUp = this.keyHandler.bind(this, 'up');
        this.sensivity = 1;
    }

    start() {
        document.addEventListener('keydown', this.onPress);
        document.addEventListener('keyup', this.onUp);
        // let gyroscope = new Gyroscope({frequency: 60});
        // gyroscope.addEventListener('reading', e => {
        //     alert(`$Y:${gyroscope.y}`);
        // });
        // gyroscope.start();
        window.addEventListener('devicemotion', this.onDeviceMotion.bind(this), true);
    }

    destroy() {
        document.removeEventListener('keydown', this.onPress);
        document.removeEventListener('keyup', this.onUp);
        window.removeEventListener('devicemotion', this.onDeviceMotion, true);
    }

    onDeviceMotion(e) {
        // e.acceleration
        this.angleY = e.accelerationIncludingGravity.y;
        this.keys['__right_incline'] = this.angleY > this.sensivity;
        this.keys['__left_incline'] = this.angleY < -this.sensivity;
        // if (this.angleY < 0) {
        //     // Наклон влево
        //     // alert(`Влево ${angleY}`);
        //     this.keys['__right_incline'] = false;
        //     this.keys['__left_incline'] = true;
        // } else {
        //     // Наклон вправо
        //     // alert(`Вправо ${angleY}`);
        //     this.keys['__right_incline'] = true;
        //     this.keys['__left_incline'] = false;
        // }
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
        this.previous = Object.assign({}, this.keys);
        return clicked;
    }
}
