export default class GameInfoComponent {

    parentElem;
    score;
    time;
    productList;
    infoElem;

    constructor({ parentElem, textSize = '30px', top = '11%', left = '2%' }) {
        this.parentElem = parentElem;
        this.score = null;
        this.time = null;
        this.productList = null;
        this.infoElem = document.createElement('div');
        this.infoElem.classList.add('game-scene__game-info-elem');
        this.infoElem.style.fontSize = textSize;
        this.infoElem.style.top = top;
        this.infoElem.style.left = left;

        this.parentElem.appendChild(this.infoElem);
    }

    setInfo({ score, time, productList }) {
        this.score = score;
        this.time = time;
        this.productList = productList;
    }

    render() {
        this.infoElem.innerHTML = `Очки: ${this.score}<br>Список покупок:<br><span class="game-info-elem__products">${this.productList}</span><br>Время: ${this.time}`;
    }

    destroy() {
        this.parentElem.removeChild(this.infoElem);
    }
}
