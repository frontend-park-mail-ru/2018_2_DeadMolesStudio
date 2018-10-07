'use strict';

// данный импорт необходим для корректной работы
// циклического импорта ViewContext.js <=> Menu.js
import {pages} from "./views/ViewsContext.js";

import {showMenu} from "./views/Menu.js";
import {showBase} from "./views/Base.js";

const startApp = () => {
    showBase();
    showMenu();
};

startApp();



