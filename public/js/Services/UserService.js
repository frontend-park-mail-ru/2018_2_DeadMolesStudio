import backDomain from '../projectSettings.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

export default class UserService {
    static FetchUser() {
        return AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            }).then( (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(response.status);
            });
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
