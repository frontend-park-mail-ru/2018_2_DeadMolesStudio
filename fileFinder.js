const fs = require('fs');
const globby = require('globby');

const dir = [
    '**/public/fonts/*.*',
    '**/public/img/**/*.*',
    '**/public/dist/*.*',
    '**/public/app/game/**/*.png',
    '**/public/app/game/**/*.jpg'];

globby(dir)
    .then( (paths) => {
        paths = paths.map(path => path.replace('public/', '') );
        fs.writeFileSync('./public/sw-files.js', 'const cacheFiles = ');
        fs.appendFileSync('./public/sw-files.js', JSON.stringify(paths), 'utf-8');
        fs.appendFileSync('./public/sw-files.js', '; ');
    });
