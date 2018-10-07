import {noop} from "../../modules/Utils.mjs";

export class ScoreboardComponent {
    constructor ({el = document.body, data = []} = {}) {
        this._el = el;
        this._data = data;
    }

    get data() {
        this._data;
    }

    set data(data) {
        this._data = data
    }

    render() {
        this._el.insertAdjacentHTML( 'beforeend',`
                    <h2>Scoreboard</h2>
                    <div class="scoreboard">
                        <ol>
                            <span class="scoreboard_head">
                                <span class="scoreboard_node__position">#</span>
                                <span class="scoreboard_node__name">Игрок</span>
                                <span class="scoreboard_node__scores">Рекорд</span>
                            </span>
                            <div class="scoreboard_list scrolable"></div>
                        </ol>
                    </div>
                    `.trim()
        );
        const scoreboardList = this._el.querySelector('.scoreboard_list');
        const scoreboardNodeTemplate = ({position, nickname, record}) => `
            <li class="scoreboard_node">
                <span class="scoreboard_node__position">${position}</span>
                <span class="scoreboard_node__name">${nickname}</span>
                <span class="scoreboard_node__scores">${record}</span>
            </li>
        `.trim();
        if ( this._data !== null ) {
            this._data.forEach( (item, i) => {
                item['position'] = i + 1;
                scoreboardList.innerHTML += scoreboardNodeTemplate(item);
            });
        }

    }

    on({event = 'click', callback = noop, capture = false}) {
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        } else {
            this._listenersToAdd.push({event: event, callback: callback, capture: capture});
        }
    }

    off({event = 'click', callback = noop, capture = false}) {
        this._innerElem.removeEventListener(event, callback, capture);
    }

}
