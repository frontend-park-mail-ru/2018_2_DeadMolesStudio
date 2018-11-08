import Figure from '../../modules/graphics/Figure.js';

export default class ImageFigure extends Figure {
    constructor(ctx, imagePath) {
        super(ctx);
        this.width = 0;
        this.height = 0;
        this.imagePath = imagePath;
        this.image = new Image(this.imagePath);
    }

    /**
     * @private
     */
    draw() {
        this.image.onload = () => {
            const { ctx } = this;
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        };
    }

    setup() {
        const { ctx } = this;

        ctx.translate(this.x, this.y);
    }
}