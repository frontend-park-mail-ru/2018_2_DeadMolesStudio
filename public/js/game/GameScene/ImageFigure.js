import Figure from '../../modules/graphics/Figure.js';

export default class ImageFigure extends Figure {
    constructor(ctx, imagePath) {
        super(ctx);
        this.width = 0;
        this.height = 0;
        this.imagePath = imagePath;
        this.image = new Image(40, 60);
        this.image.src = this.imagePath;
        this.imageLoaded = false;
        this.image.addEventListener('load', (event) => {
            console.log('LOADED');
            this.imageLoaded = true;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        });
    }

    /**
     * @private
     */
    draw() {
        const { ctx, imageLoaded } = this;
        ctx.fill();

        if (imageLoaded) {
            ctx.beginPath();
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

            ctx.closePath();
            ctx.fill();
        }
    }

    setup() {
        const { ctx } = this;

        ctx.translate(this.x, this.y);
    }
}