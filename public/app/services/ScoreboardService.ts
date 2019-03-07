import AjaxFetchModule from 'modules/AjaxFetch65.js';
import backDomain from '../projectSettings';

export default class ScoreboardService {
    /**
     Разлогинить пользователя
     * @param limit, page
     * @return {Promise} response
     */
    static async getScoreboard({ limit = 5, page = 0 } = {}) {
        const data = {
            scoreboard: null,
            ok: false,
        };

        let response = null;

        if (page === 0) {
            response = await this.fetchScoreboard();
        } else {
            response = await this.fetchPageScoreboard(limit, page);
        }

        if (response.status !== 200) {
            return data;
        }

        data.scoreboard = await response.json();
        data.ok = true;

        return data;
    }

    static fetchScoreboard() {
        return AjaxFetchModule
            .doGet({
                path: '/scoreboard?limit=5',
                domain: backDomain,
            });
    }

    static fetchPageScoreboard(limit, page) {
        return AjaxFetchModule
            .doGet({
                path: `/scoreboard?limit=${limit}&page=${page}`,
                domain: backDomain,
            });
    }
}
