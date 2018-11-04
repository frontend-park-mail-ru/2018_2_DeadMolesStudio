'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fallback = require('express-history-api-fallback');
const app = express();

const rootDir = `${__dirname}/public`;

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '.', 'public')));

app.use(fallback('index.html', { root: rootDir } ));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server started\nAddress: https://dmstudio.now.sh');
});
