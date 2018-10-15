import * as ViewsContext from './ViewsContext.js';
import {SectionComponent} from '../components/Section/Section.mjs';
import About from '../components/About/About.mjs';

export const showAbout = () => {
    const content = document.querySelector('.content');
    const aboutSection = new SectionComponent({el: content, name: 'about'});
    aboutSection.render();
    const aboutSectionContent = aboutSection.sectionContent;

    const about = new About({el: aboutSectionContent});
    about.render();

    const menuButton = ViewsContext.createBackButton(aboutSectionContent);
    menuButton.render();
};
