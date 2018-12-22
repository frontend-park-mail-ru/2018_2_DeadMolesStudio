import * as classic from './img/classic.png';
import * as coins from './img/coins.png';
import * as avatar from './img/ketnipz-default.jpg';
import ButtonComponent from 'components/Button/Button';
import GridComponent from "components/Grid/Grid";
import backDomain from "../../projectSettings";


export default class ShopComponent {

    _el;
    _data;
    _user;

    constructor({ el = document.body, data = null, user = null } = {}) {
        this._el = el;
        this._data = data.skins;
        this._user = user;
    }

    render() {

        this._el.insertAdjacentHTML('afterbegin', `
            <div class="wrap">
            <div class="wrap-block wrap-block_theme_profile">
                <div class="main-block_theme_about main-block">
                    <div class="main-block__header_theme_shop">
                        <h1 class="header header_theme_pink">Shop</h1>
                    </div>
                    <div class="shop-block">
                    </div>
                </div>
            </div>
            </div>
            `.trim()
        );

        const mainBlock = this._el.querySelector('.shop-block');

        const grid = new GridComponent({
            el: mainBlock,
            name: 'shop',
        });
        grid.render();

        const gridElem = this._el.querySelector('.grid_shop');

        if (!this._user) {
            const blockWrap = this._el.querySelector('.wrap');

            const elem = document.createElement('div');
            elem.classList.add('wrap-shop');
            blockWrap.append(elem);

            const block = this._el.querySelector('.wrap-block');
            block.classList.add('wrap-block_disabled');

            const signUp = new ButtonComponent({
                el: elem,
                text: 'Login',
                className: 'basic-btn basic-btn_theme_signup basic-btn_absolute',
                href: '/login',
            });
            signUp.render();

            this._data.forEach( (item) => {
                const div = document.createElement('div');
                this.renderDisabledSkin(div, item);
                gridElem.append(div);
            });
        } else {
            this.renderProfile();

            this._data.forEach( (item) => {
                const div = document.createElement('div');
                if (item.id === this._user.current_skin) {
                    this.renderActiveSkin(div, item);

                } else if ( this._user.skins.indexOf(item.id) !== -1 ) {
                    this.renderEnableSkin(div, item);
                } else {
                    this.renderDisabledSkin(div, item);
                }

                gridElem.append(div);
            });

        }
    }

    renderEnableSkin(parent, item) {
        parent.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-card">
                <div class="shop-card">
                    <div class="shop-card__name">${item.name}</div>
                    <img src=${classic} alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );

        const btnBlock = parent.querySelector('.shop-card__button');
        const btn = new ButtonComponent({
            el: btnBlock,
            text: 'Choose',
            className: 'basic-btn basic-btn_theme_shop_choise app-router-ignore',
        });

        btn.render();

    }

    fetchBuy(id) {

    }

    renderDisabledSkin(parent, item) {
        parent.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-card">
                <div class="shop-card">
                    <div class="shop-card__name">${item.name}</div>
                    <img src=${classic} alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );

        const money = `<div class="shop-card__coins">
                        <img src=${coins} alt="" class="shop-card__img-coins">
                        ${item.cost}
                    </div>`;

        const btnBlock = parent.querySelector('.shop-card__button');
        const btn = new ButtonComponent({
            el: btnBlock,
            text: money,
            className: 'basic-btn basic-btn_theme_shop_buy app-router-ignore',
        });

        btn.render();

        btn.on({
           event: 'click',
           callback: (event) => {
               event.preventDefault();



           }
        });
    }

    renderActiveSkin(parent, item) {
        parent.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-card">
                <div class="shop-card shop-card_active">
                    <div class="shop-card__name">${item.name}</div>
                    <img src=${classic} alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );
    }

    renderProfile() {
        const block = document.querySelector('.userBlock');
        block.insertAdjacentHTML('afterbegin', `
            <div class="menu-user menu-user_media">
                <img src=${this._user.avatar ? backDomain + this._user.avatar : avatar} alt="ava" class="menu-user__avatar">
                <div class="menu-user__inf">
                    <a href="/profile" class="menu-user__name_shop">${this._user.nickname}</a>
                    <div class="menu-user__score_shop">
                         <img src=${coins} alt="" class="menu-user__score-img_shop">
                            100
                    </div>    
                </div>            
            </div>
        `.trim());
    }

}
