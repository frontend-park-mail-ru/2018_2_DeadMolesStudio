import BaseView2 from 'views/Base2';
import ButtonComponent from 'components/Button/Button';
import UserState from 'modules/User';
import BackButtonComponent from 'components/BackButton/BackButton';
import GridComponent from 'components/Grid/Grid';
import PreGameComponent from 'components/PreGame/PreGame';
import launchFullscreen, { exitFullscreen } from 'modules/fullscreenAPI/fullscreen.js';

export default class PreGameView extends BaseView2{
    render() {
        super.render();

        const mainBlock = this._el.querySelector('.container');
        mainBlock.classList.add('container_pregame');
        mainBlock.classList.remove('container');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'pregame',
            structure: this.structureView,
        });
        grid.render();

        const menuButton = new BackButtonComponent({
            el: grid.getItem('backButton'),
        });
        menuButton.render();
        menuButton.on({
            event: 'click',
            callback: () => {
                exitFullscreen();
            }
        });

        const single = new PreGameComponent({
            el: grid.getItem('preGameBlock1'),
        });

        single.render();

        const multi = new PreGameComponent({
            el: grid.getItem('preGameBlock2'),
            type: 'Multiplayer',
        });

        multi.render();

        const documentEl = document.documentElement;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
            // Take the user to a different screen here.
            launchFullscreen(documentEl);
        }

        if (!UserState.isAuth() || !navigator.onLine) {
            const block = mainBlock.querySelector('.pregame-multiplayer');
            block.classList.add('pregame-block_not_auth');
            const button = block.querySelector('.basic-btn');
            button.classList.add('basic-btn_none');

            if (navigator.onLine) {
                const wrapBlock = mainBlock.querySelector('.wrap-multiplayer');

                const signUp = new ButtonComponent({
                    el: wrapBlock,
                    text: 'Login',
                    className: 'basic-btn basic-btn_theme_signup basic-btn_absolute',
                    href: '/login',
                });
                signUp.render();
            }
        }

    }

    get structureView() {
        return [
            'preGameBlock1',
            'preGameBlock2',
            'backButton',
        ];
    }
}
