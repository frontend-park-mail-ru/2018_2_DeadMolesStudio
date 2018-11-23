import backDomain from '../projectSettings.js';
import bus from '../modules/EventBus.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class UserService {
    static FetchUser() {
        return AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            });
    }

    // static FetchUser() {
    //     return AjaxFetchModule
    //         .doGet({
    //             path: '/profile',
    //             domain: backDomain,
    //         }).then( (response) => {
    //             if (response.status === 200) {
    //                 return response.json();
    //             }
    //             return Promise.reject(response.status);
    //         });
    // }

    static async getUser() {
        const response = await this.FetchUser();
        const data = {
            user: null,
            err: {
                status: 200,
                text: null,
            },
            ok: false,
        };

        if (response.status === 401) {
            data.err.status = 401;
            data.err.text = 'Надо авторизоваться!';
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.text = 'Что-то пошло не так!';
            return data;
        }

        data.user = await response.json();
        data.ok = true;
        return data;
    }

    static FetchSignUpUser(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/profile',
                domain: backDomain,
                body: req,
            })
            .then( (response) => {
                if (response.status === 200) {
                    return response;
                }
                return Promise.reject(response);
            });
    }

    static FetchUpdateUpUser(req = {}) {
        return AjaxFetchModule
            .doPut({
                path: '/profile',
                domain: backDomain,
                body: req,
            })
            .then( (response) => {
                if (response.status === 200) {
                    return response;
                }
                return Promise.reject(response);
            });
    }
}
