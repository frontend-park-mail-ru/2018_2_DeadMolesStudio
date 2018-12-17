import ButtonComponent from "../Button/Button";


export default class PreGameComponent{

    _el;
    _type;

    constructor({el = document.body, type ='Singleplayer'} = {}) {
        this._el = el;
        this._type = type;
    }

    render() {
        this._el.insertAdjacentHTML('beforeend', `
            <div class="wrap-${this._type.toLowerCase()}">
                <div class="pregame-block pregame-${this._type.toLowerCase()}" >
                    <div class="pregame-block__name">
                        ${this._type}
                    </div>
                    <div class="pregame-block__description">
                        ${this.text}
                    </div>
                    <img class="pregame-block__img" src="../../../img/pregame-${this._type.toLowerCase()}.png">
                    <div class="pregame-block__button"></div>
                </div>
            </div>
        `.trim());


        const blockButton = this._el.querySelector('.pregame-block__button');
        this.renderButton(blockButton);
    }

    get text() {
        if (this._type === 'Singleplayer') {
            return 'In a singleplayer catch as many items from list as possible in 30 seconds';
        } else {
            return 'In a multiplayer mode try and catch more items than your competitor';
        }
    }

    renderButton(parent) {
        let href = null;
        if (this._type === 'Singleplayer') {
            href = '/play';
        } else {
            href = '/multiplayer';
        }
        const playButton = new ButtonComponent({
            el: parent,
            href: href,
            text: 'Play',
            className: 'basic-btn basic-btn_theme_pregame',
        });

        playButton.render();
    }
}