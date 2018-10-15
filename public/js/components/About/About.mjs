export default class AboutComponent {
    constructor({el = document.body, data = rules} = {}) {
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
            this._data.forEach((item) => {
                const ruleNode = `<p>${item}</p>`;
                rulesList.innerHTML += ruleNode;
            });
        }
    }
};

const rules = [
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo accusamus magni ut numquam illum dolorem eum asperiores repellat eligendi iste magnam dolore dicta optio necessitatibus veniam, laborum minus, quasi impedit! ",
    "Nisi tempora explicabo iusto nihil libero corporis ad error quam maxime doloribus ducimus possimus inventore necessitatibus temporibus tempore quidem, ea officiis quia architecto vero laboriosam, sint rem pariatur quaerat fuga? Tempora a quia nobis voluptatibus error ex, magni accusantium voluptate perferendis. Iste alias architecto harum nulla non labore rerum qui, tempore possimus id aperiam cumque ullam unde voluptate fugit odio molestiae at repudiandae minus aliquam deserunt earum maiores reiciendis. Voluptates!",
];
