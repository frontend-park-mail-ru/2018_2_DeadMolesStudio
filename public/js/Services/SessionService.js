import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import backDomain from '../projectSettings.js';

export default class SessionService {
    static FetchLogin(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/session',
                domain: backDomain,
                body: req,
            });
    }

    static FetchLogout() {
        return AjaxFetchModule
            .doDelete({
                path: '/session',
                domain: backDomain,
            });
    }

    /**
     Разлогинить пользователя
     * @return {Promise} response
     */
    static async logout() {
        const response = await this.FetchLogout();
        return response;
    }

    /**
     Авторизация пользователя
     * @param formData
     * @return Object data
     */
    static async login(formData) {
        const data = {
            err: {
                status: 200,
                errors: [],
            },
            ok: false,
        };

        const email = formData.email.value;
        const password = formData.password.value;

        if (!(email && password) ) {
            data.err.errors.push({
                text: 'Заполните оба поля!',
            });
            return data;
        }

        const req = {
            email: email,
            password: password,
        };

        const response = await this.FetchLogin(req);

        if (response.status === 422) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Неверная пара почта/пароль',
            });
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Что-то пошло не так!',
            });
            return data;
        }

        data.ok = true;
        return data;
    }
}
