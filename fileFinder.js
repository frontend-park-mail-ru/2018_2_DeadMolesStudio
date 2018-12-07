const fs = require('fs');
const globby = require('globby');

const dir = ['**/public/template.html',
    '**/public/css/*.*',
    '**/public/fonts/*.*',
    '**/public/img/**/*.*',
    '**/public/dist/*.*',
    '**/public/app/**/*.*',
    '**/public/app/game/**/*.*',
    '!**/public/app/**/*.js',
    '!**/public/app/**/*.mjs'];

globby(dir)
    .then( (paths) => {
        paths = paths.map(path => path.replace('public/', '') );
        fs.writeFileSync('./public/sw-files.js', 'const cacheFiles = ');
        fs.appendFileSync('./public/sw-files.js', JSON.stringify(paths), 'utf-8');
        fs.appendFileSync('./public/sw-files.js', '; ');
    });
