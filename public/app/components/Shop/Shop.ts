import * as k1 from './img/ketnipz1.png';
import * as k2 from './img/ketnipz2.png';
import * as k3 from './img/ketnipz3.png';
import * as k4 from './img/ketnipz4.png';
import * as k5 from './img/ketnipz5.png';
import * as k6 from './img/ketnipz6.png';
import * as coins from './img/coins.png';
import * as avatar from './img/ketnipz-default.jpg';
import ButtonComponent from 'components/Button/Button';
import GridComponent from "components/Grid/Grid";
import backDomain from "../../projectSettings";
import bus from 'modules/EventBus';


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
            <div class="wrap-shop"></div>
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
            const wrap = this._el.querySelector('.wrap-shop');
            wrap.classList.add('wrap-shop_disabled');

            const block = this._el.querySelector('.wrap-block');
            block.classList.add('wrap-block_disabled');

            const signUp = new ButtonComponent({
                el: wrap,
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
                    this.renderActiveSkin(div, item)
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
                    <img  alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );

        const img = parent.querySelector('img');
        this.getImg(img, item.id);

        const btnBlock = parent.querySelector('.shop-card__button');
        const btn = new ButtonComponent({
            el: btnBlock,
            text: 'Choose',
            className: 'basic-btn basic-btn_theme_shop_choise app-router-ignore',
        });

        btn.render();

        btn.on({
            event: 'click',
            callback: (event) => {
                event.preventDefault();
                this.fetchChoose(item.id);
            }
        });

    }

    fetchBuy(id) {
        bus.emit('fetch-buy-skin', id);
    }

    fetchChoose(id) {
        bus.emit('fetch-choose-skin', id);
    }

    renderDisabledSkin(parent, item) {
        parent.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-card">
                <div class="shop-card">
                    <div class="shop-card__name">${item.name}</div>
                    <img alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );

        const img = parent.querySelector('img');
        this.getImg(img, item.id);

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
                this.fetchBuy(item.id);
           }
        });
    }

    renderActiveSkin(parent, item) {
        parent.insertAdjacentHTML(
            'afterbegin', `
            <div class="wrap-card">
                <div class="shop-card shop-card_active">
                    <div class="shop-card__name">${item.name}</div>
                    <img alt="" class="shop-card__img">
                    <div class="shop-card__button"></div>
                </div>
            </div>
            `.trim()
        );

        const img = parent.querySelector('img');
        this.getImg(img, item.id);
    }

    renderProfile() {
        const mainBlock = document.querySelector('.grid_user-shop');
        const block = mainBlock.querySelector('.userBlock');
        block.insertAdjacentHTML('afterbegin', `
            <div class="menu-user menu-user_media">
                <img src=${this._user.avatar ? backDomain + this._user.avatar : avatar} alt="ava" class="menu-user__avatar">
                <div class="menu-user__inf">
                    <a href="/profile" class="menu-user__name_shop">${this._user.nickname}</a>
                    <div class="menu-user__score_shop">
                         <img src=${coins} alt="" class="menu-user__score-img_shop">
                            ${this._user.coins}
                    </div>    
                </div>            
            </div>
        `.trim());
    }

    getImg(parent, id) {
        switch (id) {
            case 1:
                parent.setAttribute('src', k1);
                break;
            case 2:
                parent.setAttribute('src', k2);
                break;
            case 3:
                parent.setAttribute('src', k3);
                break;
            case 4:
                parent.setAttribute('src', k4);
                break;
            case 5:
                parent.setAttribute('src', k5);
                break;
            case 6:
                parent.setAttribute('src', k6);
                break;
        }
    }

}
