/**
 *Main application file
 */

'use strict';

var express = require('express');


var app = express();
require('./oauth/login/spotify-Oauth.js')(app, express);
// require('spotsOauth.js')(app, express);

var server = require('http').createServer(app);
console.log('Jam City on port 8008')
app.listen(8008);
exports = module.exports = app;
