import Figure from '../../modules/graphics/Figure.js';
import Rect from '../../modules/graphics/Rect.js';
import ImageFigure from "./ImageFigure.js";

export default class GamePlayerFigure extends Figure {
    constructor(ctx) {
        super(ctx);

        this.body = new ImageFigure(ctx, './ketnipz.png');

        this.body.width = 30;
        this.body.height = 100;
        this.x = 0;
        this.y = 0;
    }

    /**
     * @private
     */
    draw() {
        this.body.x = this.x;
        this.body.y = this.y;

        this.body.render();
    }

    setup() {}
}
