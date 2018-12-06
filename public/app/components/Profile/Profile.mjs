import backDomain from '../../projectSettings.js';

export default class ProfileComponent {
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
            <div class="profile">
                <h2>Профиль</h2>
            </div>
            `.trim()
        );

        const profileBlock = this._el.querySelector('.profile');
        const {
            nickname,
            email,
            record,
            win,
            draws,
            loss,
            avatar,
        } = this._data;

        console.log(avatar);
        const profile = {
            'Никнейм: ': nickname,
            'Почта: ': email,
            'Рекорд: ': record,
            'Побед: ': win,
            'Ничьих: ': draws,
            'Поражений: ': loss,
            'Винрейт: ': `${loss + win === 0 ? 100 : ( (win / (loss + win) ) * 100).toFixed(2)}%`,
        };
        for (const [field, value] of Object.entries(profile) ) {
            profileBlock.insertAdjacentHTML(
                'beforeend', `
                <div>
                    <b>${field}</b>
                    <span>${value}</span>
                </div>
                `.trim()
            );
        }
        profileBlock.insertAdjacentHTML(
            'beforeend', `
                <img src="${backDomain + avatar}" alt="аватар" class="user-avatar-block">
                `.trim()
        );
    }
}

// <img src="../../../img/ketnipz-default.jpg" alt="аватар" class="user-avatar-block">
