import * as avatar from './img/ketnipz-default.jpg';

export default class GameInfoComponent {

    parentElem;
    score;
    time;
    productList;
    infoElem;
    nickname;
    avatar;
    isOpponent;

    constructor({ parentElem, textSize = '30px', top = '1%', isOpponent = false, nickname = null, avatar = null, left = null, right = null }) {
        this.parentElem = parentElem;
        this.score = null;
        this.productList = null;
        this.infoElem = document.createElement('div');
        this.isOpponent = isOpponent;
        this.infoElem.classList.add('game-scene__game-info-elem');
        if (isOpponent) {
            this.infoElem.classList.add('game-scene__game-info-elem_opponent')
        }
        this.infoElem.style.fontSize = textSize;
        this.infoElem.style.top = top;
        this.parentElem.appendChild(this.infoElem);
        this.nickname = nickname;
        this.avatar = avatar;
        if (right !== null ) {
            this.infoElem.style.right = right;
        } else {
            this.infoElem.style.left = left ? left : '2%';
        }
    }

    setInfo({ score, productList, nickname = null, avatar = null }) {
        this.score = score;
        this.productList = productList;
        this.nickname = nickname ? nickname : this.nickname;
        this.avatar = avatar ? avatar : this.avatar;
    }

    userBlock() {
        // TODO: AVATAR!!!!!
        const res = this.nickname ? `
            <div class="menu-user menu-user_theme_game_info">
                <img src=${this.avatar ? this.avatar : avatar} alt="ava" class="menu-user__avatar">
                <div class="menu-user__inf">
                    <span class="menu-user__name_theme_game_info">${this.nickname}</span>
                </div>          
            </div>
        ` : '';
        return res;
    }

    render() {
        this.infoElem.innerHTML = `
            ${this.userBlock()}
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
