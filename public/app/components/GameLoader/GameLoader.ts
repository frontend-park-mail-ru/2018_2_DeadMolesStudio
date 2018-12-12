import LoaderComponent from '../Loader/Loader';

export default class GameLoaderComponent {

    _el;
    _parent;

    constructor(el) {
        this._parent = el;
        this._el = document.createElement('div');
        this._el.className = 'game-loader';
    }

    render() {
        const loader = new LoaderComponent(this._el);
        loader.render();
        const description = document.createElement('div');
        description.className = 'game-loader__description';
        description.innerText = 'Search for an opponent';
        this._el.appendChild(description);
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