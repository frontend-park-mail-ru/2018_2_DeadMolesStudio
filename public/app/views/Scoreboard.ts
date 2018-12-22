import BackButtonComponent from 'components/BackButton/BackButton';
import GridComponent from 'components/Grid/Grid';
import BaseView2 from 'views/Base2';
import LoaderComponent from 'components/Loader/Loader';
import ScoreboardComponent from 'components/Scoreboard/Scoreboard';
import bus from 'modules/EventBus';


export default class ScoreboardView extends BaseView2 {

    dataScoreboard;

    constructor(el) {
        super(el);

        this.dataScoreboard = null;

        bus.on('scoreboard:get-data', this.setData.bind(this) );
    }

    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'casual',
            structure: this.structureView,
        });
        grid.render();

        this.renderTitleGame(grid.getItem('mainHeader') );

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();

        if (!this.dataScoreboard) {
            this.renderLoading(grid.getItem('content') );
        } else {
            this.renderScoreboard(grid.getItem('content') );
        }
    }


    fetchData() {
        bus.emit('fetch-scoreboard');
    }

    setData(data) {
        this.dataScoreboard = data;
        this.render();
    }

    show() {
        super.show();
        this.fetchData();
    }

    renderLoading(parent) {
        const loader = new LoaderComponent(parent);
        loader.render();
    }

    renderScoreboard(parent) {
        const { players, total } = this.dataScoreboard;
        const scoreboard = new ScoreboardComponent({
            el: parent,
            data: players,
            total: total,
        });
        scoreboard.render();
    }

    get structureView() {
        return [
            'mainHeader',
            'backButton',
            'content',
        ];
    }
}
