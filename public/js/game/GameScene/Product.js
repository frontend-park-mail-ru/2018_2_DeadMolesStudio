import Figure from '../../modules/graphics/Figure.js';
import PRODUCTS from "./ProductTypes.js";

export default class GameProductFigure extends Figure {
    constructor(ctx) {
        super(ctx);

        // this.body = new ImageFigure(this.ctx, 'js/game/GameScene/ketnipz.png');

        this.x = 0;
        this.y = 0;
        this.direction = 'RIGHT';
        this.type = 0;
        this.text = PRODUCTS[this.type];
        this.textSize = '40';
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        ctx.font = `${this.textSize}pt Arial`;
        ctx.fillStyle = 'black';
        this.text = PRODUCTS[this.type];

        ctx.fillText(this.text, this.x, this.y);
        // this.body.x = this.x;
        // this.body.y = this.y;
        // this.body.direction = this.direction;
        //
        // this.body.render();
    }

    setup() {}
}
