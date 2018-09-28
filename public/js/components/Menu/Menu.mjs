import {ButtonComponent} from "../Button/Button.mjs";
import {noop} from "../../modules/Utils.mjs";

export class MenuComponent {
    constructor({el = document.body, titles = {}, actionOnButton = noop} = {}) {
        this._el = el;
        this._titles = titles;
        this._actionOnButton = actionOnButton;
    }

    render() {
        const menu = document.createElement("div");
        menu.className = "menu";

        Object.entries(this._titles).forEach( (entry) => {
            const href = entry[0];
            const title = entry[1];

            const button = new ButtonComponent({
                el: menu,
                href: href,
                text: title
            });

            button.on({
                event: "click",
                callback: this._actionOnButton,
            });

            button.render();
        });

        this._el.appendChild(menu);

    }

}