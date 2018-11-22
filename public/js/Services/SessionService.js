import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import backDomain from '../projectSettings.js';

export default class SessionService {
    static FetchLogin(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/session',
                domain: backDomain,
                body: req,
            })
            .then( (response) => {
                if (response.status === 200) {
                    return response;
                }
                return Promise.reject(response.status);
            });
    }

    static FetchLogout() {
        return AjaxFetchModule
            .doDelete({
                path: '/session',
                domain: backDomain,
            })
            .then( () => Promise.resolve() )
            .catch( () => Promise.reject() );
    }
}
