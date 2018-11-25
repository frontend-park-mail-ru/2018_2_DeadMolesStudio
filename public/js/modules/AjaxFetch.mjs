export default class AjaxFetchModule {
    static _ajax({
        method = 'GET', path = '/', domain = '', contentType = null, body,
    } = {}) {
        const url = domain + path;

        const options = {
            mode: 'cors',
            credentials: 'include',
            method: method,
        };

        if (body) {
            if (contentType === null) {
                options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
                options.body = JSON.stringify(body);
            } else {
                options.headers = { 'Content-Type': contentType };
                options.body = body;
            }
        }

        return fetch(url, options);
    }

    static doGet(params = {}) {
        return this._ajax({ ...params, method: 'GET' });
    }

    static doPost(params = {}) {
        return this._ajax({ ...params, method: 'POST' });
    }

    static doDelete(params = {}) {
        return this._ajax({ ...params, method: 'DELETE' });
    }

    static doPut(params = {}) {
        return this._ajax({ ...params, method: 'PUT' });
    }
}
