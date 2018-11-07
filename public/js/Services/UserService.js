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
}
