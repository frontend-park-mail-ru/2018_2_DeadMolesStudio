import backDomain from '../projectSettings';
import AjaxFetchModule from '../modules/AjaxFetch';
import userState from 'modules/User';

export default class ShopService {
    /**
     Получение всех скинов
     * @return skin
     */
    static async getSkins() {
        const data = {
            skins: null,
            ok: false,
            err: null,
        };

        const response = await this.fetchSkins();

        if (response.status !== 200) {
            data.err = 'Something went wrong!';
            return data
        }

        data.skins = await response.json();
        data.ok = true;

        return data;
    }

    /**
     Обновить текущий скин пользователя
     * @param id
     * @return data
     */
    static async updateUserSkin(id) {
        const data = {
            err: null,
            ok: false,
        };

        const req = {
            'skin': id,
        };

        const response = await this.fetchChangeSkin(req);

        if (response.status === 401) {
            data.err = 'You must be logged in.';
            return data
        }

        if (response.status === 422) {
            data.err = 'You should buy Ketnipz.';
            return data
        }

        if (response.status !== 200) {
            data.err = 'Something went wrong!';
            return data
        }

        data.ok = true;
        return data;
    }

    /**
     Купить новый скин
     * @param id
     * @return data
     */
    static async buyUserSkin(id) {
        const data = {
            err: null,
            ok: false,
        };

        const req = {
            'skin': id,
        };

        const response = await this.fetchBuySkin(req);

        if (response.status === 401) {
            data.err = 'You must be logged in.';
            return data
        }

        if (response.status === 422) {
            data.err = 'Not enough money to buy';
            return data
        }

        if (response.status !== 200) {
            data.err = 'Something went wrong!';
            return data
        }

        data.ok = true;
        return data;
    }

    static fetchSkins() {
        return AjaxFetchModule
            .doGet({
                path: '/profile/skin',
                domain: backDomain,
            });
    }

    static fetchChangeSkin(req = {}) {
        return AjaxFetchModule
            .doPut({
                path: '/profile/skin',
                domain: backDomain,
                body: req,
            });
    }

    static fetchBuySkin(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/profile/skin',
                domain: backDomain,
                body: req,
            });
    }
}