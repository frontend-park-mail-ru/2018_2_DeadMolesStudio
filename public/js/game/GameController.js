export default class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.previous = {};
        this.keys = {};

        this.onPress = this.keyHandler.bind(this, 'press');
        this.onUp = this.keyHandler.bind(this, 'up');
    }

    start() {
        document.addEventListener('keydown', this.onPress);
        document.addEventListener('keyup', this.onUp);
    }

    destroy() {
        document.removeEventListener('keydown', this.onPress);
        document.removeEventListener('keyup', this.onUp);
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
