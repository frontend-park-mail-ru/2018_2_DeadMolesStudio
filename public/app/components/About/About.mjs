const rules = [
    'Передвигая героя влево и вправо, вам необходимо собирать продукты, которые указаны в списке продуктов, за них вам будет начиляться по 3 очка',
    'За предметы, которые не входят в ваш список покупок у вас будет отниматься по 1 очку.',
    'Управление:',
    'Влево: <- или A',
    'Вправо: -> или D',
];

export default class AboutComponent {
    constructor({ el = document.body, data = rules } = {}) {
        this._el = el;
        this._data = data;
    }

    render() {
        this._el.insertAdjacentHTML(
            'afterbegin',
            `
            <div class="rules">
                <h2>Как играть?</h2>
            </div>
            `.trim()
        );

        const rulesList = this._el.querySelector('.rules');
        if (this._data !== null) {
            this._data.forEach( (item) => {
                const ruleNode = `<p>${item}</p>`;
                rulesList.innerHTML += ruleNode;
            });
        }
    }
}
