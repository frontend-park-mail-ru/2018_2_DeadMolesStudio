import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import backDomain from '../projectSettings.js';

export default class ScoreboardService {
    static FetchScoreboard() {
        return AjaxFetchModule
            .doGet({
                path: '/scoreboard?limit=10',
                domain: backDomain,
            })
            .then( (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(response.status);
            });
    }

    static FetchPageScoreboard(limit, page) {
        return AjaxFetchModule
            .doGet({
                path: `/scoreboard?limit=${limit}&page=${page}`,
                domain: backDomain,
            })
            .then( (response) => {
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(response.status);
            });
    }
}
