import Figure from '../../modules/graphics/Figure.js';
import ImageFigure from './ImageFigure.js';

export default class GamePlayerFigure extends Figure {
    constructor(ctx, meWidth, meHeight) {
        super(ctx);

        this.body = new ImageFigure(this.ctx, 'js/game/GameScene/img/ketnipz.png');
        this.bodyJump = new ImageFigure(this.ctx, 'js/game/GameScene/img/ketnipz_jump.png');
        console.log(meWidth, meHeight);
        this.body.width = meWidth;
        this.body.height = meHeight;
        this.bodyJump.width = meWidth;
        this.bodyJump.height = meHeight;
        this.jumping = false;
        this.x = 0;
        this.y = 0;
        this.direction = 'RIGHT';
    }

    /**
     * @private
     */
    draw() {
        const { ctx } = this;
        if (this.jumping) {
            this.bodyJump.x = this.x;
            this.bodyJump.y = this.y;
            this.bodyJump.direction = this.direction;
            this.bodyJump.render();
        } else {
            this.body.x = this.x;
            this.body.y = this.y;
            this.body.direction = this.direction;
            this.body.render();
        }
    }

    setup() {}
}
