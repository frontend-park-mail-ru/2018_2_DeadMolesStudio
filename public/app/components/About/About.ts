const rules = [
    'Shift the character left and right in order to move it. Your goal is to collect the products from the shopping list.',
    'You get 3 points for catching each of them. If the item is not listed, you lose 1 point.',
];

export default class AboutComponent {

    _el;
    _data;

    constructor({ el = document.body, data = rules } = {}) {
        this._el = el;
        this._data = data;
    }

    render() {
        this._el.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-block wrap-block_theme_profile">
                <div class="main-block_theme_about main-block">
                    <div class="main-block__header_theme_about">
                        <h1 class="header header_theme_pink">How to play</h1>
                    </div>
                    <div class="about-block">
                        <div class="about-block__text">
                        </div>
                        <div class="about-block__control">
                            <div class="about-block__control-header">Control</div>
                            <div class="about-block__control-wrap">
                                <div class="about-block__control-item">
                                    <p class="about-block__item-header">mobile</p>
                                    <img src="../img/mobile-play.png" alt="" class="about-block__control-img">
                                    <p class="about-block__item-text">Tap to jump</p>
                                </div>
                                <div class="about-block__control-item">
                                    <p class="about-block__item-header">desktop</p>
                                    <img src="../img/button-play.png" alt="" class="about-block__control-img">
                                    <p class="about-block__item-text">And WASD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `.trim()
        );

        const rulesList = this._el.querySelector('.about-block__text');
        if (this._data !== null) {
            this._data.forEach( (item) => {
                const ruleNode = `<p class = about-block__text-item>${item}</p>`;
                rulesList.innerHTML += ruleNode;
            });
        }
    }
}
