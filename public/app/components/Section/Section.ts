export default class SectionComponent {

    _el;
    _name;
    _sectionContent;

    constructor({ el = document.body, name = 'index' } = {}) {
        this._el = el;
        this._name = name;
        this._sectionContent = null;
    }

    render() {
        this._el.insertAdjacentHTML('beforeend', `
            <section class="${this._name}_page">
                <div class="${this._name}__main">
                </div>
            </section>
            `.trim() );

        this._sectionContent = this._el.querySelector(`.${this._name}__main`);
    }

    append(el = '') {
        if (this._sectionContent === null) {
            console.log('You cant append before render');
        } else {
            this._sectionContent.appendChild(el);
        }
    }

    get sectionContent() {
        return this._sectionContent;
    }
}
