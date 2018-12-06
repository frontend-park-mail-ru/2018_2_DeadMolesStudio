export default class Scene {

    ctx;
    frontView;
    backView;
    figures;
    _curFigureID;

    constructor(ctx) {
        this.ctx = ctx;
        this.frontView = [];
        this.backView = [];
        this.figures = {};

        this._curFigureID = 0;
    }

    getNextFigureID() {
        return `#${ this._curFigureID++ }`;
    }

    push(figure) {
        const id = this.getNextFigureID();
        this.figures[id] = figure;
        this.frontView.push(figure);

        return id;
    }

    toFront(id) {
        const figure = this.figures[id];
        this.backView = this.backView.filter( (item) => {
            return item !== figure;
        });
        this.frontView = this.frontView.filter( (item) => {
            return item !== figure;
        });
        this.frontView.push(figure);
    }

    toBack(id) {
        const figure = this.figures[id];
        this.backView = this.backView.filter( (item) => {
            return item !== figure;
        });
        this.frontView = this.frontView.filter( (item) => {
            return item !== figure;
        });
        this.backView.push(figure);
    }

    removeFigure(id) {
        const figure = this.figures[id];
        this.backView = this.backView.filter( (item) => {
            return item !== figure;
        });
        this.frontView = this.frontView.filter( (item) => {
            return item !== figure;
        });

        delete this.figures[id];
        if (Object.keys(this.figures).length === 0) {
            console.log('Scene is empty!');
        }
    }

    render() {
        const { ctx } = this;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.backView.forEach( figure => figure.render() );
        this.frontView.forEach( figure => figure.render() );
    }

    clear() {
        const { ctx } = this;
        // for (let figure in this.figures) {
        //     this.removeFigure(figure.id);
        // }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}
