import Figure from './Figure.js';

export default class Rect extends Figure {
    constructor(ctx) {
        super(ctx);
        this.width = 0;
        this.height = 0;
        this.fillStyle = 'black';
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.closePath();
        ctx.fill();
    }

    setup() {
        const { ctx } = this;

        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.fillStyle;
    }
}