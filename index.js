const http = require('http');
const fs = require('fs');
const debug = require('debug');

const log = debug('*');

const server = http.createServer((req, res) => {
	const filename = req.url === '/' ? './public/index.html' : `./public${req.url}`;

	log('request: %s', req.url);
	const file = fs.readFile(filename, (err, file) => {
		if (err) {
			log('file %s not found', filename);

			res.statusCode = 404;
			res.end('404');
			return;
		}

		log('file found %s', filename);
		res.write(file);
		res.end();
	});
});

server.listen('3000');