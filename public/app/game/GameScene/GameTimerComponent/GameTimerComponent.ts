export default class GameTimerComponent {

    parentElem;
    timerElem;
    time;

    constructor({ parentElem, textSize = '30px', top = '4%', left = '50%', time = 30 }) {
        this.parentElem = parentElem;
        this.timerElem = document.createElement('div');
        this.time = time;
        this.timerElem.classList.add('game-scene__game-timer');
        this.timerElem.style.fontSize = textSize;
        this.timerElem.style.top = top;
        this.timerElem.style.left = left;

        this.parentElem.appendChild(this.timerElem);
    }

    render() {
        this.timerElem.innerHTML = `${this.time}`
    }

    destroy() {
        this.timerElem.innerHTML = '';
        this.parentElem.removeChild(this.timerElem);
    }
}