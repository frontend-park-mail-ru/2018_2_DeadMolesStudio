import BackButtonComponent from '../components/BackButton/BackButton.ts';
import GridComponent from '../components/Grid/Grid.ts';
import BaseView2 from './Base2.ts';
import About from '../components/About/About.ts';


export default class AboutView extends BaseView2 {
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

        const about = new About({ el: grid.getItem('content') });
        about.render();
    }

    get structureView() {
        return [
            'mainHeader',
            'backButton',
            'content',
        ];
    }
}
