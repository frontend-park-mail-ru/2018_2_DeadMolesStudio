import backDomain from '../projectSettings.js';
import BaseView from './Base.js';

import ButtonComponent from '../components/Button/Button.mjs';
import LoaderComponent from '../components/Loader/Loader.js';
import SectionComponent from '../components/Section/Section.mjs';
import ScoreboardComponent from '../components/Scoreboard/Scoreboard.mjs';

import bus from '../modules/EventBus.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class ScoreboardView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const scoreboardSection = new SectionComponent({ el: content, name: 'scoreboard' });
        scoreboardSection.render();
        const scoreboardSectionContent = scoreboardSection.sectionContent;

        const loader = new LoaderComponent(scoreboardSectionContent);
        loader.render();

        AjaxFetchModule
            .doGet({
                path: '/scoreboard?limit=10',
                domain: backDomain,
            })
            .then( (response) => {
                if (response.status === 200) {
                    response.json()
                        .then( (data) => {
                            if (data !== null) {
                                loader.hide();

                                const { players, total } = data;
                                const scoreboard = new ScoreboardComponent({
                                    el: scoreboardSection.sectionContent,
                                    data: players,
                                    total: total,
                                });
                                scoreboard.render();

                                const menuButton = new ButtonComponent({ el: scoreboardSectionContent });
                                menuButton.render();
                            }
                        });
                } else {
                    alert('Что-то пошло не так.');
                    bus.emit('showmenu');
                }
            })
            .catch( (err) => {
                console.log(err);
                alert('Что-то пошло не так.');
                bus.emit('showmenu');
            });
    }
}
