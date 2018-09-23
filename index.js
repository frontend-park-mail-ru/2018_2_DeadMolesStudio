const http = require('http');
const fs = require('fs');
const debug = require('debug');

const log = debug('*');

const users = [
    {
        login: "Артем",
        scores: 150,
        position: 1
    },
    {
        login: "Ксюша",
        scores: 140,
        position: 2
    },
    {
        login: "Кирилл",
        scores: 100,
        position: 3
    },
    {
        login: "Анатолий",
        scores: 99,
        position: 4
    },
    {
        login: "Дмитрий",
        scores: 98,
        position: 5
    },
    {
        login: "Сергей",
        scores: 97,
        position: 6
    },
];

const profile = {
    nickname: "TOPgamer228",
    record: 100500,
    win: 21,
    draws: 2,
    loss: 15,
};

const server = http.createServer((req, res) => {

	if (req.url === '/users') {
        log('request: %s', req.url);
        const usersJSON = JSON.stringify(users);
        res.write(usersJSON);
        res.end();
        return;
    }

    if (req.url === '/profile') {
        log('request: %s', req.url);
        const profileJSON = JSON.stringify(profile);
        res.write(profileJSON);
        res.end();
        return;
    }

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