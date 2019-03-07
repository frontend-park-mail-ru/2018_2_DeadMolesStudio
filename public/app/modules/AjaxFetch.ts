export default class AjaxFetchModule {
    static _ajax({
        method = 'GET', path = '/', domain = '', contentType = null, body = JSON.stringify({}),
    } = {}) {
        const url = domain + path;

        const options: RequestInit = {
            mode: 'cors',
            credentials: 'include',
            method: method,
        };

        if (body) {
            if (contentType === null) {
                options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
                options.body = JSON.stringify(body);
            } else {
                console.log('dcdsdff');
                // options.headers = { 'Content-Type': 'multipart/form-data' };
                options.body = body;
            }
        }

        return fetch(url, options);
    }

    static doGet(params = {}) {
        return this._ajax({ body: '', ...params, method: 'GET' });
    }

    static doPost(params = {}) {
        return this._ajax({ body: '', ...params, method: 'POST' });
    }

    static doDelete(params = {}) {
        return this._ajax({ body: '', ...params, method: 'DELETE' });
    }

    static doPut(params = {}) {
        return this._ajax({ body: '', ...params, method: 'PUT' });
    }
}
