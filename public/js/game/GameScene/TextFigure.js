import Figure from '../../modules/graphics/Figure.js';

export default class TextFigure extends Figure {
    constructor(ctx) {
        super(ctx);
        this.font = '14pt arial';
        this.fillStyle = 'black';
        this.text = '';
        this.x = 10;
        this.y = 20;
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
