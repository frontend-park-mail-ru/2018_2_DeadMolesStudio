import ButtonComponent from '../Button/Button';
import backDomain from '../../projectSettings';


export default class ProfileComponent {

    _el;
    _data;

    constructor({ el = document.body, data = {} } = {}) {
        this._el = el;
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set data(data) {
        this._data = data;
    }

    render() {
        this._el.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-block wrap-block_theme_profile">
                <div class="main-block_theme_profile main-block">
                    <div class="main-block__header_theme_profile">
                        <h1 class="header header_theme_pink">Profile</h1>
                    </div>
                    <div class="profile-block">
                        <div class="profile-block__user-inf">
                        </div>
                        <div class="profile-block__user-game">
                            <div class="profile-block__title">Stats</div>
                        </div>
                    </div>
                </div>
            </div>
            `.trim()
        );

        const {
            nickname,
            email,
            record,
            win,
            draws,
            loss,
            avatar,
        } = this._data;

        const userBlock = this._el.querySelector('.profile-block__user-inf');

        const user = {
            'nickname': nickname,
            'email': email,
        };

        let pathAvatar = null;

        if (avatar) {
            pathAvatar = backDomain + avatar;
        } else {
            pathAvatar = '../../../img/ketnipz-default.jpg';
        }


        userBlock.insertAdjacentHTML(
            'beforeend', `
                <div class="profile-block__profile-avatar">
                    <img src=${pathAvatar} alt="аватар" class="user-avatar">
                </div>
                `.trim()
        );

        const btnBlock = this._el.querySelector('.profile-block__profile-avatar');

        const editProfileButton = new ButtonComponent({
            el: btnBlock,
            href: '/profile/settings',
            text: '',
            className: 'basic-btn profile-block__settings-btn',
        });

        editProfileButton.render();

        for (const [field, value] of Object.entries(user) ) {
            userBlock.insertAdjacentHTML(
                'beforeend', `
                <div class="profile-block__profile-item profile-block__profile-item_theme_${field}">
                    ${value}
                </div>
                `.trim()
            );
        }

        if (user.nickname.length <= 10) {
            const nickname = this._el.querySelector('.profile-block__profile-item_theme_nickname');
            nickname.classList.add('profile-block__profile-item_font_big');
        }

        if (user.email.length >= 18) {
            const nickname = this._el.querySelector('.profile-block__profile-item_theme_email');
            nickname.classList.add('profile-block__profile-item_font_small');
        }

        const userGameBlock = this._el.querySelector('.profile-block__user-game');
        const userGame = {
            'Record: ': record,
            'Wins: ': win,
            'Draws: ': draws,
            'Loss: ': loss,
            'WinRate: ': `${loss + win === 0 ? 100 : ( (win / (loss + win) ) * 100).toFixed(2)}%`,
        };

        for (const [field, value] of Object.entries(userGame) ) {
            userGameBlock.insertAdjacentHTML(
                'beforeend', `
                <div class="profile-block__profile-item">
                    <b>${field}</b>
                    ${value}
                </div>
                `.trim()
            );
        }



    }
}

