import * as ViewsContext from "./ViewsContext.js";
import {SectionComponent} from "../components/Section/Section.mjs";
import {ScoreboardComponent} from "../components/Scoreboard/Scoreboard.mjs";
import {AjaxFetchModule} from "../modules/AjaxFetch.mjs";
import {showMenu} from "./Menu.js";

export const showScoreboard = () => {
    const content = document.querySelector(".content");

    const scoreboardSection = new SectionComponent({el: content, name: 'scoreboard'});

    const em = document.createElement('em');
    em.textContent = 'Loading';

    scoreboardSection.render();
    scoreboardSection.append(em);

    AjaxFetchModule.doGet({
        path: '/scoreboard?limit=10',
        domain: ViewsContext.backDomain
    }).then( (response) => {
        if ( response.status === 200 ) {

            response.json().then( (data) => {
                console.log(data);
                if ( data !== null || data !== 'null') {
                    const users = data['players'];
                    scoreboardSection.sectionContent.removeChild(em);
                    console.log(data);

                    const scoreboard = new ScoreboardComponent({el: scoreboardSection.sectionContent, data: users});
                    scoreboard.render();
                }

                const menuButton = ViewsContext.createBackButton(scoreboardSection.sectionContent);
                menuButton.render();
            });
        } else {
            const em = document.createElement('em');
            em.textContent = 'Что-то пошло не так!';
            scoreboardSection.append(em);
        }
    }).catch( err => {
        console.log(err);
    });

};