const fs = require('fs');
const globby = require('globby');

const dir = ['**/public/index.html',
    '**/public/css/*.*',
    '**/public/js/**/*.*',
    '**/public/img/**/*.*',
    '**/public/js/game/**/*.*',
    '!**/public/js/Service/*.*'];

globby(dir)
    .then( (paths) => {
        paths = paths.map(path => path.replace('public/', '') );
        fs.writeFileSync('./public/sw-files.js', 'const cacheFiles = ');
        fs.appendFileSync('./public/sw-files.js', JSON.stringify(paths), 'utf-8');
        fs.appendFileSync('./public/sw-files.js', '; ');
    });
