import Figure from '../../modules/graphics/Figure';
import PRODUCTS from './ProductTypes';

export default class GameProductFigure extends Figure {

    id;
    textSize;
    direction;

    type;
    text;

    constructor(ctx) {
        super(ctx);

        this.id = null;
        this.x = 0;
        this.y = 0;
        this.direction = 'RIGHT';
        this.type = 0;
        this.text = PRODUCTS[this.type];
        this.textSize = '40';
        this.fillStyle = 'black';
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        ctx.font = `${this.textSize}pt Arial`;
        ctx.fillStyle = this.fillStyle;
        this.text = PRODUCTS[this.type];

        ctx.fillText(this.text, this.x, this.y);
    }

    setup() {}
}
