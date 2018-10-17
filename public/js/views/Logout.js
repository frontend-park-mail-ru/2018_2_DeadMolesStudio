import * as ViewsContext from './ViewsContext.js';
import { showLogin } from './Login.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';

const doLogout = () => {
    AjaxFetchModule.doDelete({
        path: '/session',
        domain: ViewsContext.backDomain,
    }).then( () => {
        showLogin();
    });
};

export default doLogout;
