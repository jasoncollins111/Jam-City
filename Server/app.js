/**
 *Main application file
 */

'use strict';

var express = require('express');


var app = express();
var server = require('http').createServer(app);

app.listen(8008);

exports = module.exports = app;