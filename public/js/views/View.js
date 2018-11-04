/*
* @class View - каркас для создания любой view
* @module modules
*/
export default class View {
    constructor(el) {
        console.log('View()');
        this._el = el;

        this._el.dataset['view'] = this.constructor.name;
        this._el.hidden = true;
    }

    get isActive() {
        return !this._el.hidden;
    }

    hide() {
        this._el.hidden = true;
    }

    show() {
        this._el.hidden = false;
        this.render();
    }

    render() {}
}
