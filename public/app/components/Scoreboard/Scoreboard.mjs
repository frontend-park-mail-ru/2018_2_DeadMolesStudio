import ButtonComponent from '../Button/Button.mjs';
import bus from '../../modules/EventBus.js';

export default class ScoreboardComponent {
    constructor({
        el = document.body, data = [], limit = 5, total = 5,
    } = {}) {
        this._el = el;
        this._data = data;
        this._page = 0;
        this._limit = limit;
        this._total = total;
        this._first = 1;

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
                <h2>Scoreboard</h2>
                <div class="scoreboard">
                    <ol>
                        <span class="scoreboard_head">
                            <span class="scoreboard_node__position">#</span>
                            <span class="scoreboard_node__name">Игрок</span>
                            <span class="scoreboard_node__scores">Рекорд</span>
                        </span>
                        <div class="scoreboard_list scrolable"></div>
                        <div class="scoreboard__paginator"></div>
                    </ol>
                </div>
                `.trim()
        );

        const paginator = this._el.querySelector('.scoreboard__paginator');
        const prevButton = new ButtonComponent({ el: paginator, text: '<', className: 'cute-btn app-router-ignore' });
        const nextButton = new ButtonComponent({ el: paginator, text: '>', className: 'cute-btn app-router-ignore' });
        const pageIndicator = document.createElement('span');
        pageIndicator.className = 'page-indicator';
        pageIndicator.textContent = '1';

        prevButton.render();
        paginator.appendChild(pageIndicator);
        nextButton.render();

        prevButton.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
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
        this._scoreboardList = this._el.querySelector('.scoreboard_list');
        const scoreboardNodeTemplate = ({ position, nickname, record }) => `
            <li class="scoreboard_node">
                <span class="scoreboard_node__position">${position}</span>
                <span class="scoreboard_node__name">${nickname}</span>
                <span class="scoreboard_node__scores">${record}</span>
            </li>
        `.trim();


        if (this._data) {
            this._data.forEach( (item, i) => {
                const position = this._first + i;
                this._scoreboardList.innerHTML += scoreboardNodeTemplate({ ...item, position });
            });
        }
    }
}
