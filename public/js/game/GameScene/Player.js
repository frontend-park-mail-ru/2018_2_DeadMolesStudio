import Figure from '../../modules/graphics/Figure.js';
import ImageFigure from "./ImageFigure.js";

export default class GamePlayerFigure extends Figure {
    constructor(ctx) {
        super(ctx);

        this.body = new ImageFigure(this.ctx, 'js/game/GameScene/ketnipz.png');

        this.body.width = 30;
        this.body.height = 100;
        this.x = 0;
        this.y = 0;
        this.direction = 'RIGHT';
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        this.body.x = this.x;
        this.body.y = this.y;
        this.body.direction = this.direction;

        this.body.render();
    }

    setup() {}
}
