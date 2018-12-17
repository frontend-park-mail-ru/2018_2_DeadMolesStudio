import Figure from '../../modules/graphics/Figure';
import ImageFigure from './ImageFigure';
import TextFigure from "./TextFigure";

export default class GamePlayerFigure extends Figure {

    body;
    bodyJump;
    jumping;
    direction;
    isOpponent;

    nameFigure;
    nameText;
    nameDeltaY;
    nameDeltaX

    constructor(ctx, meWidth, meHeight, isOpponent = false, name?) {
        super(ctx);

        if (!name) {
            this.nameText = isOpponent ? 'Enemy' : 'Me';
        } else {
            this.nameText = name;
        }

        if (isOpponent) {

            this.body = new ImageFigure(this.ctx, 'app/game/GameScene/img/ketnipz_enemy.png');
            this.bodyJump = new ImageFigure(this.ctx, 'app/game/GameScene/img/ketnipz_enemy_jump.png');
        } else {
            this.body = new ImageFigure(this.ctx, 'app/game/GameScene/img/ketnipz.png');
            this.bodyJump = new ImageFigure(this.ctx, 'app/game/GameScene/img/ketnipz_jump.png');
        }
        this.isOpponent = isOpponent;

        this.body.width = meWidth;
        this.body.height = meHeight;

        this.bodyJump.width = meWidth;
        this.bodyJump.height = meHeight;
        this.jumping = false;
        this.x = 0;
        this.y = 0;
        this.direction = 'RIGHT';

        this.nameDeltaY = 70;
        this.nameDeltaX = this.nameText.length / 2 * 12;
        this.nameFigure = new TextFigure(ctx, 14);
        this.nameFigure.text = this.nameText;
        this.nameFigure.x = this.x - this.nameDeltaX;
        this.nameFigure.y = this.y - this.nameDeltaY;
        this.nameFigure.fillStyle = 'black';
        this.nameFigure.font = '14pt FashionFont'

    }

    set name(nickname) {
        this.nameFigure.text = nickname;
        this.nameText = nickname;
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
        this.nameFigure.x = this.x - this.nameDeltaX;
        this.nameFigure.y = this.y - this.nameDeltaY;
        this.nameFigure.render();
    }

    setup() {}
}
