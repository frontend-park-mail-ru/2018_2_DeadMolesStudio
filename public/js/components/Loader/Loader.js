export default class LoaderComponent {
    constructor(el) {
        this._parent = el;
        this._el = document.createElement('div');
    }

    render() {
        this._el.className = 'bouncing-loader';
        this._el.innerHTML = '<div></div>'.repeat(3);
        this._parent.appendChild(this._el);
    }

    hide() {
        this._el.hidden = true;
        this._parent.removeChild(this._el);
    }

    show() {
        this._el.hidden = false;
    }
}
