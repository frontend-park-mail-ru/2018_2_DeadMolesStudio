import AjaxFetchModule from 'modules/AjaxFetch65.js';
import userState from 'modules/User';
import backDomain from '../projectSettings';

export default class SessionService {
    /**
     Разлогинить пользователя
     * @return {Promise} response
     */
    static async logout() {
        const response = await this.fetchLogout();

        if (response.status === 200) {
            userState.deleteUser();
        }

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

        data.err.errors.push({
            text: '',
        });

        if (!(email && password) ) {
            data.err.errors.push({
                text: 'Fill in both fields!',
            });
            return data;
        }

        const req = {
            email: email,
            password: password,
        };

        const response = await this.fetchLogin(req);

        if (response.status === 422) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Invalid mail / password pair',
            });
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Something went wrong',
            });
            return data;
        }

        data.ok = true;
        return data;
    }

    static fetchLogin(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/session',
                domain: backDomain,
                body: req,
            });
    }

    static fetchLogout() {
        return AjaxFetchModule
            .doDelete({
                path: '/session',
                domain: backDomain,
            });
    }
}
