import LoaderComponent from 'components/Loader/Loader';

export default class GameLoaderComponent {

    _el;
    _parent;
    _rendered;

    constructor(el) {
        this._parent = el;
        this._el = document.createElement('div');
        this._el.className = 'game-loader';
        this._rendered = false;
    }

    render() {
        const loader = new LoaderComponent(this._el);
        loader.render();
        const description = document.createElement('div');
        description.className = 'game-loader__description';
        description.innerText = 'Search for an opponent';
        this._el.appendChild(description);
        this._parent.appendChild(this._el);
        this._rendered = true;
    }

    hide() {
        if (this._rendered) {
            this._el.hidden = true;
            this._parent.removeChild(this._el);
        }
    }

    show() {
        this._el.hidden = false;
    }
}