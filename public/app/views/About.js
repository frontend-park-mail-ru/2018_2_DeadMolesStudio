import BaseView from './Base.js';

import SectionComponent from '../components/Section/Section.mjs';
import About from '../components/About/About.mjs';
import ButtonComponent from '../components/Button/Button.mjs';

export default class AboutView extends BaseView {
    render() {
        super.render();
        const content = this._el.querySelector('.content');

        const aboutSection = new SectionComponent({ el: content, name: 'about' });
        aboutSection.render();
        const aboutSectionContent = aboutSection.sectionContent;

        const about = new About({ el: aboutSectionContent });
        about.render();

        const menuButton = new ButtonComponent({ el: aboutSectionContent });
        menuButton.render();
    }
}
