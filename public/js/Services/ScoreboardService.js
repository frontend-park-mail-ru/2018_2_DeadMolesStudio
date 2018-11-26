import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import backDomain from '../projectSettings.js';

export default class ScoreboardService {
    static FetchScoreboard() {
        return AjaxFetchModule
            .doGet({
                path: '/scoreboard?limit=5',
                domain: backDomain,
            });
    }

    static FetchPageScoreboard(limit, page) {
        return AjaxFetchModule
            .doGet({
                path: `/scoreboard?limit=${limit}&page=${page}`,
                domain: backDomain,
            });
    }

    static async getScoreboard({ limit = 5, page = 0 } = {}) {
        const data = {
            scoreboard: null,
            ok: false,
        };

        let response = null;

        if (page === 0) {
            response = await this.FetchScoreboard();
        } else {
            response = await this.FetchPageScoreboard(limit, page);
        }

        if (response.status !== 200) {
            return data;
        }

        data.scoreboard = await response.json();
        data.ok = true;

        return data;
    }
}
