import ButtonComponent from '../Button/Button';
import GridComponent from "../Grid/Grid";
import backDomain from '../../projectSettings';


export default class MenuComponent {

    _el;
    _titles;
    _user;
    _auth;

    constructor({ el = document.body, titles = {}, user = null, auth = true } = {}) {
        this._el = el;
        this._titles = titles;
        this._user = user;
        this._auth = auth;
    }

    render() {

        const grid = new GridComponent({
            el: this._el,
            name: 'menu',
            structure: this.structureView,
        });
        grid.render();

        this.renderInfoButton(grid.getItem('infoButton') );
        this.renderSettingsButton(grid.getItem('settingsButton') );

        if (navigator.onLine) {
            if (this._auth) {
                this.renderUserBlock(grid.getItem('userBlock') );
            } else {
                this.renderLoginBlock(grid.getItem('userBlock') );
            }
        }

        this.renderPlay(grid.getItem('content') );
    }

    get structureView() {
        return [
            'mainHeader',
            'infoButton',
            'settingsButton',
            'userBlock',
            'content',
        ];
    }

    renderPlay(parent) {
        parent.insertAdjacentHTML('afterbegin', `
            <div class="play-block">
            </div>
        `.trim()
        );

        const block = parent.querySelector('.play-block');

        const playButton = new ButtonComponent({
            el: block,
            href: '/pregame',
            text: '',
            className: 'basic-btn basic-btn_theme_play',
        });

        playButton.render();
        this.setPlayBtn(block);

        if (navigator.onLine) {
            const leadersButton = new ButtonComponent({
                el: block,
                href: '/scoreboard',
                text: 'Leaders',
                className: 'basic-btn basic-btn_theme_leaders',
            });

            leadersButton.render();
        }
    }

    renderSettingsButton(parent) {
        const settingsButton = new ButtonComponent({
            el: parent,
            href: '/about',
            text: '',
            className: 'basic-btn basic-btn_theme_settings',
        });

        settingsButton.render();
    }

    renderInfoButton(parent) {
        const infoButton = new ButtonComponent({
            el: parent,
            href: '/about',
            text: 'i',
            className: 'basic-btn basic-btn_theme_info',
        });

        infoButton.render();
    }

    renderLoginBlock(parent) {
        parent.insertAdjacentHTML('afterbegin', `
            <div class="menu-user menu-user_margin"></div>
        `.trim()
        );

        const block = parent.querySelector('.menu-user');

        const loginBtn = new ButtonComponent({
            el: block,
            href: '/login',
            text: 'Login',
            className: 'menu-user__login',
        });

        loginBtn.render();

    }

    renderUserBlock(parent) {
        let pathAvatar = null;

        if (this._user.avatar) {
            pathAvatar = backDomain + this._user.avatar;
        } else {
            pathAvatar = '../../../img/ketnipz-default.jpg';
        }

        parent.insertAdjacentHTML('afterbegin', `
            <div class="menu-user">
                <img src=${pathAvatar} alt="ava" class="menu-user__avatar">
                <div class="menu-user__inf">
                    <a href="/profile" class="menu-user__name">${this._user.nickname}</a>
                    <div class="menu-user__score">Score: ${this._user.record}</div>     
                </div>          
                <div class="menu-user__logout"></div>   
            </div>
        `.trim()
        );

        const logoutBlock = parent.querySelector('.menu-user__logout');

        const logoutBtn = new ButtonComponent({
            el: logoutBlock,
            href: '/logout',
            text: '',
            className: 'basic-btn basic-btn_theme_logout',
        });

        logoutBtn.render();

    }

    setPlayBtn(parent) {
        const playBtn = parent.querySelector('.basic-btn_theme_play');

        playBtn.animate([
            { transform: 'scale(1)', filter: 'none' },
            { transform: 'scale(1.02)', filter: 'saturate(1.2)' },
        ], {
            duration: 700,
            easing: 'ease-in-out',
            delay: 30,
            iterations: Infinity,
            direction: 'alternate',
            fill: 'forwards',
        });
    }
}
