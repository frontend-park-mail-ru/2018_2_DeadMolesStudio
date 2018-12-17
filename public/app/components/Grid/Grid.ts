export default class GridComponent {

    _el;
    _name;
    _structure;
    _grid;

    constructor({ el = document.body, name = 'index', structure = []} = {}) {
        this._el = el;
        this._name = name;
        this._grid = null;
        this._structure = structure;
    }

    render() {
        this._el.insertAdjacentHTML('beforeend', `
        <div class="grid_${this._name}"></div>
        `.trim());

        this._grid = this._el.querySelector(`.grid_${this._name}`);

        this.createStructure();
    }

    createStructure() {
        this._structure.forEach( (item) => {
            this._grid.innerHTML += `<div class="${item}"></div>`;
        });
    }

    getItem(item) {
        return this._grid.querySelector(`.${item}`);
    }


}