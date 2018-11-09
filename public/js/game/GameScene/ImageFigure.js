import Figure from '../../modules/graphics/Figure.js';

export default class ImageFigure extends Figure {
    constructor(ctx, imagePath) {
        super(ctx);
        this.width = 0;
        this.height = 0;
        this.imagePath = imagePath;
        this.image = new Image();
        this.imageLoaded = false;
        this.image.onload = () => {
            const scale = 0.2;
            this.imageLoaded = true;
            this.width = scale * this.image.width;
            this.height = scale * this.image.height;
            console.log('OLO', this.width, this.height);
        };
        this.image.src = this.imagePath;
        this.direction = 'RIGHT';
    }

    /**
     * @private
     */
    draw() {
        // ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height, this.width, this.height);

        if (this.imageLoaded) {
            if (this.direction === 'RIGHT') {
                this.flipImage(this.image, false);
            } else if (this.direction === 'LEFT') {
                this.flipImage(this.image, true);
            }
        }
    }

    setup() {}

    flipImage(image, flipH) {
        const scaleH = flipH ? -1 : 1; // Set horizontal scale to -1 if flip horizontal
        // const posX = flipH ? -1 * (this.x + this.width / 2) : this.x - this.width / 2;
        const posX = scaleH * this.x - this.width / 2;

        this.ctx.save(); // Save the current state
        this.ctx.scale(scaleH, 1); // Set scale to flip the image
        this.ctx.drawImage(this.image, posX, this.y - this.height, this.width, this.height);
        this.ctx.restore(); // Restore the last saved state
    }
}