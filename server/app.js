/**
 *Main application file
 */

 'use strict';
var express = require('express'),
    app = express(),
    port = 8080,
    SpotifyWebApi = require('spotify-web-api-node'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    passportSpotify=require('passport-spotify'),
    SpotifyStrategy = require('./spotifyAuth/lib/passport-spotify/index').Strategy,
    keys = require('./keys.js'),
    clientID = keys.clientID,
    clientSecret = keys.clientSecret,
    spotifyApi = new SpotifyWebApi({
      clientId : clientID,
      clientSecret : clientSecret,
      redirectUri : 'http://localhost:8008/callback'
    });

    app.use(express.static(__dirname + '/../client'));
    passport.serializeUser(function(user, done) {
      console.log('user ', user)
      done(null, user);
    });
    passport.deserializeUser(function(sessionUser, done) {
      done(null, sessionUser);
    });
    passport.use(new SpotifyStrategy({
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: 'http://localhost:8080/callback'
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          spotifyApi.setAccessToken(accessToken);
          return done(null, profile);
        });
    }));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(methodOverride());
    app.use(session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next){
      console.log('req session obj', req.session);
      next();
    })
    require('./spotifyAuth/spotifyController.js')(app, express, passport, spotifyApi);
    console.log('Jam City on port ', port);
    app.listen(port);
    exports = module.exports = app;
