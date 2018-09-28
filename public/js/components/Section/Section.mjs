export class SectionComponent {
    constructor({el = document.body, name = 'index' } = {}) {
        this._el = el;
        this._name = name;
        this._sectionContent = null;
    }

    render() {
        this._el.innerHTML += `
            <section class="${this._name}_page">
				<div class="${this._name}__main">
				</div>
			</section>
        `.trim();

        this._sectionContent = this._el.getElementsByClassName(`${this._name}__main`)[0];
    }

    append(el = '') {
        if ( this._sectionContent === null ) {
            console.log("You cant append before render");
        } else {
            this._sectionContent.appendChild(el);
        }
    }

    get sectionContent() {
        return this._sectionContent;
    }


}