import { noop } from './Utils.js';

export default class AjaxModule {
    static _ajax({ callback = noop, method = 'GET', path = '/', domain = '', body } = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, domain + path, true);
        xhr.withCredentials = true;

        if (body) {
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            callback(xhr);
        };

        if (body) {
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    }

    static doGet(params = {}) {
        this._ajax({ ...params, method: 'GET' });
    }

    static doPost(params = {}) {
        this._ajax({ ...params, method: 'POST' });
    }

    static doDelete(params = {}) {
        this._ajax({ ...params, method: 'DELETE' });
    }
}
