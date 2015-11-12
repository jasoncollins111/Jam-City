/**
 *Main application file
 */

'use strict';
var express = require('express');
var app = express();
var port = 8008;

require('./spotifyAuth/login/spotify.js')(app, express);

console.log('Jam City on port ', port);
app.listen(port);
exports = module.exports = app;
