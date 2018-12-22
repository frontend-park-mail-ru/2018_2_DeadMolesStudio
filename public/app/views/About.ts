import BackButtonComponent from 'components/BackButton/BackButton';
import GridComponent from 'components/Grid/Grid';
import BaseView2 from 'views/Base2';
import About from 'components/About/About';

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
