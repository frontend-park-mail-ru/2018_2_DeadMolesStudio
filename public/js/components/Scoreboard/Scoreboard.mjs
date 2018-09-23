console.log("import module Scoreboard.mjs");

export const RENDER_TYPES = {
    DOM: "dom",
    STRING: "string",
    TMPL: "template"
};

export class ScoreboardComponent {
    constructor ({el = document.body, type = RENDER_TYPES.DOM} = {}) {
        this._el = el;
        this._type = type;
    }

    get data() {
        this._data;
    }

    set data(data = []) {
        this._data = data
    }

    render () {
        if(!this._data) {
            return;
        }

        switch (this._type) {
            case RENDER_TYPES.DOM:
                this._renderDOM();
                return;
            case RENDER_TYPES.STRING:
                this._renderString();
                return;
            case RENDER_TYPES.TMPL:
                this._renderTMPL();
                return;
        }

        //сюда отображение юзеров
        this._el.appendChild();
    }

    _renderTMPL () {

    }

    _renderDOM () {
        //тут наш ужасный код с appendChild'ами
    }

    _renderString () {
        this._el.innerHTML = `
            
            `.trim();
    }
}
