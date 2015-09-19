/**
 *Main application file
 */

'use strict';

var express = require('express');


var app = express();
// require('./express.js')(app)
require('./spotifyAuth/login/spotify.js')(app, express);

var server = require('http').createServer(app);
console.log('Jam City on port 8008')
app.listen(8008);
exports = module.exports = app;
