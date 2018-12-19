export default class GameInfoComponent {

    parentElem;
    score;
    time;
    productList;
    infoElem;

    constructor({ parentElem, textSize = '30px', top = '1%', left = null, right = null }) {
        this.parentElem = parentElem;
        this.score = null;
        this.productList = null;
        this.infoElem = document.createElement('div');
        this.infoElem.classList.add('game-scene__game-info-elem');
        this.infoElem.style.fontSize = textSize;
        this.infoElem.style.top = top;
        this.parentElem.appendChild(this.infoElem);
        if (right !== null ) {
            console.log('right', right, left);
            this.infoElem.style.right = right;
        } else {
            console.log('left', right, left);
            this.infoElem.style.left = left ? left : '2%';
        }
    }

    setInfo({ score, productList }) {
        this.score = score;
        this.productList = productList;
    }

    render() {
        this.infoElem.innerHTML = `
            Score: ${this.score}<br>
            Shopping list:<br>
            <span class="game-info-elem__products">
                ${this.productList}
            </span>
        `;
    }

    destroy() {
        this.infoElem.innerHTML = '';
        this.parentElem.removeChild(this.infoElem);
    }
}
