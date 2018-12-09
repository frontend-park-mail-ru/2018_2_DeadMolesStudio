import BaseView from './Base';
import SectionComponent from '../components/Section/Section';
import About from '../components/About/About';
import ButtonComponent from '../components/Button/Button';

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
