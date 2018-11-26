import BaseView from './Base.js';

import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';
import SectionComponent from '../components/Section/Section.mjs';
import ScoreboardComponent from '../components/Scoreboard/Scoreboard.mjs';

import bus from '../modules/EventBus.js';


export default class ScoreboardView extends BaseView {
    constructor(el) {
        super(el);

        this.dataScoreboard = null;

        bus.on('scoreboard:get-data', this.setData.bind(this) );
    }

    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const scoreboardSection = new SectionComponent({ el: content, name: 'scoreboard' });
        scoreboardSection.render();
        const scoreboardSectionContent = scoreboardSection.sectionContent;

        const changingBlock = document.createElement('div');
        scoreboardSectionContent.appendChild(changingBlock);

        if (!this.dataScoreboard) {
            this.renderLoading(changingBlock);
        } else {
            this.renderScoreboard(changingBlock);
        }

        const menuButton = new ButtonComponent({ el: scoreboardSectionContent });
        menuButton.render();
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
}
