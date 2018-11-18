import Figure from '../../modules/graphics/Figure.js';

export default class TextFigure extends Figure {
    constructor(ctx, textSize = 40) {
        super(ctx);
        this.fillStyle = 'white';
        this.text = '';
        this.x = 10;
        this.y = 20;
        this.font = `${textSize}pt arial`;
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        ctx.font = this.font;
        ctx.fillStyle = this.fillStyle;
        ctx.fillText(this.text, this.x, this.y);
    }

    setup() {}
}
