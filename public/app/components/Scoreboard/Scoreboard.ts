import ButtonComponent from '../Button/Button';
import bus from '../../modules/EventBus';
import userState from '../../modules/User';


export default class ScoreboardComponent {

    _el;
    _data;
    _page;
    _limit;
    _total;
    _first;
    _fetchData;
    _scoreboardList;

    constructor({
        el = document.body, data = [], limit = 5, total = 5,
    } = {}) {
        this._el = el;
        this._data = data;
        this._page = 0;
        this._limit = limit;
        this._total = total;
        this._first = 1;

        this._scoreboardList = null;
        this._fetchData = null;
        bus.on('scoreboard:get-page', this.setFetchData.bind(this) );
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    setFetchData(data) {
        this._fetchData = data;
        const { players, total } = this._fetchData;
        this._data = players;
        this._total = total;
        this.showPlayers();
    }

    fetchPage(limit, page) {
        bus.emit('fetch-page-scoreboard', { limit, page });
    }

    render() {
        this._el.insertAdjacentHTML(
            'beforeend', `
                <div class="wrap-block wrap-block_theme_profile">
                    <div class="main-block_theme_scoreboard main-block">
                        <div class="main-block__header_theme_scoreboard">
                            <h1 class="header header_theme_pink">Scoreboard</h1>
                        </div>
                        <div class="scoreboard-block">
                            <div class="scoreboard-block__head">
                                <div class="scoreboard-block__item">
                                    <div class="scoreboard-block__item-position">#</div>
                                    <div class="scoreboard-block__item-name">Players</div>
                                    <div class="scoreboard-block__item-score">Record</div>
                                </div>
                            </div>
                            <div class="scoreboard-block__list"></div>
                            <div class="scoreboard-block__pagination">
                                <div class="scoreboard-block__page-btn prev"></div>
                                <div class="scoreboard-block__page"></div>
                                <div class="scoreboard-block__page-btn next"></div>
                            </div>
                        </div>
                    </div> 
                    
                </div>
                `.trim()
        );

        const firstBtn = this._el.querySelector('.prev');
        const secondBtn = this._el.querySelector('.next');

        const prevButton = new ButtonComponent({
            el: firstBtn,
            text: '<',
            className: 'basic-btn basic-btn_theme_arrow app-router-ignore prev-btn'
        });

        const nextButton = new ButtonComponent({
            el: secondBtn,
            text: '>',
            className: 'basic-btn basic-btn_theme_arrow app-router-ignore next-btn'
        });

        const pageIndicator = this._el.querySelector('.scoreboard-block__page');
        pageIndicator.textContent = '1';

        // if (this._page !== 0 ) {
        //     prevButton.render();
        // }

        prevButton.render();
        nextButton.render();


        prevButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();

                this.updateButtonState();

                if (this._page === 0) {
                    return;
                }

                this.hidePlayers();
                this._page -= 1;
                this._first = this._page * this._limit + 1;
                pageIndicator.textContent = this._page + 1;
                this.fetchPage(this._limit, this._page);
            },
        });

        nextButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();

                this.updateButtonState();

                if (this._total < (this._page + 1) * this._limit + 1) {
                    return;
                }

                this.hidePlayers();
                this._page += 1;
                this._first = this._page * this._limit + 1;
                pageIndicator.textContent = this._page + 1;
                this.fetchPage(this._limit, this._page);
            },
        });

        this.showPlayers();
    }

    hidePlayers() {
        this._scoreboardList.innerHTML = '';
    }

    showPlayers() {
        this._scoreboardList = this._el.querySelector('.scoreboard-block__list');
        const scoreboardNodeTemplate = ({ position, nickname, record }) => `
            <div class="scoreboard-block__item">
                <div class="scoreboard-block__item-position">${position}</div>
                <div class="scoreboard-block__item-name">${nickname}</div>
                <div class="scoreboard-block__item-score">${record}</div>
            </div>
        `.trim();

        const scoreboardNodeTemplateUser = ({ position, nickname, record }) => `
            <div class="scoreboard-block__item scoreboard-block__item_theme_user">
                <div class="scoreboard-block__item-position">${position}</div>
                <div class="scoreboard-block__item-name">${nickname}</div>
                <div class="scoreboard-block__item-score">${record}</div>
            </div>
        `.trim();


        if (this._data) {
            this._data.forEach( (item, i) => {
                const position = this._first + i;

                if (userState.isAuth() && userState.getUser().nickname === item.nickname ) {
                    this._scoreboardList.innerHTML += scoreboardNodeTemplateUser({ ...item, position });
                } else {
                    this._scoreboardList.innerHTML += scoreboardNodeTemplate({ ...item, position });
                }
            });
        }
    }

    updateButtonState() {
        if (this._total < (this._page + 1) * this._limit + 1) {
            const btn = this._el.querySelector('.next-btn');
            btn.classList.add('basic-btn_theme_arrow_disabled');
        } else {
            const btn = this._el.querySelector('.next-btn');
            btn.classList.remove('basic-btn_theme_arrow_disabled');
        }

        if (this._page === 0) {
            const btn = this._el.querySelector('.prev-btn');
            btn.classList.add('basic-btn_theme_arrow_disabled');
        } else {
            const btn = this._el.querySelector('.prev-btn');
            btn.classList.remove('basic-btn_theme_arrow_disabled');
        }
    }
}
