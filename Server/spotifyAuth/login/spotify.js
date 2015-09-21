

var

    http = require('http'),
    SpotifyWebApi = require('spotify-web-api-node'),
    https = require('https'),
    mongo = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    passportSpotify=require('passport-spotify'),
    swig = require('swig'),
    SpotifyStrategy = require('../lib/passport-spotify/index').Strategy,
    app = require('../../app.js'),
    mongoose = require('mongoose'),
    uriUtil = require('mongodb-uri'),
    MongoStore = require('connect-mongo')(session),
    consolidate = require('consolidate'),
    DB,
    keys = require('../../keys.js'),
    hasJamCity = false;

    // require('./config/express.js')
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.

module.exports = function (app, express) {

    var appKey = keys.appKey ;
    var appSecret = keys.appSecret;
    var User;
    var currentUser;
    var trackArray = [];

    var mongoUri = keys.mongodbUri;
    var mongooseUri = uriUtil.formatMongoose(mongoUri);
    var playlistId;
  mongoose.connect(mongooseUri)
  // var User = mongoose.model('Users', {spotifyId: String})
    var sessionOpts = {
      saveUninitialized: true, // saved new sessions
      resave: false, // do not automatically write to the session store
      store: new MongoStore({mongooseConnection: mongoose.connection}),
      secret: 'keyboard cat',
      cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
    }
// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : appKey,
  clientSecret : appSecret,
  redirectUri : 'http://localhost:8008/callback'
});

passport.serializeUser(function(user, done) {
  console.log('user', user)
  var sessionUser = user
  done(null, sessionUser);
});

passport.deserializeUser(function(sessionUser, done) {
  done(null, sessionUser);
});


// Use the SpotifyStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and spotify
//   profile), and invoke a callback with a user object.
passport.use(new SpotifyStrategy({
  clientID: appKey,
  clientSecret: appSecret,
  callbackURL: 'http://localhost:8008/callback'
},
function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
      // console.log(User)

        spotifyApi.setAccessToken(accessToken);
        return done(null, profile);
      // });
     });
    }));


// var app = express();

// configure Express
app.use(express.static(__dirname + '/../../../client'));
// app.set('views', __dirname + '/../../../client');
// app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(session(sessionOpts))

// app.use(session({
//   secret: 'keyboard cat',
//   cookie : {
//       maxAge: 3600000 // see below
//     },
//     store : new MongoStore({mongooseConnection: mongoose.connection})
// }));
 // Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.engine('html', consolidate.swig);





// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback

app.get('/auth/spotify',
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private','playlist-modify-public'], showDialog: true}),
  function(req, res){
// The request will be redirected to spotify for authentication, so this
// function will not be called.
console.log(res)
});


// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }), function(req, res) {
    currentUser = res.req.user.id

    //find if JamCity playlist exists
    //create if not there
    spotifyApi.getUserPlaylists(currentUser)
    .then(function(data) {
     bigD = data.body.items

     bigD.forEach(function(item){
      // console.log('playlistName', item.name)
      if(item.name === 'city jams'){
        console.log('city jams exists');
        playlistId = item.id
        console.log(playlistId)
        hasJamCity = true;
        // console.log(hasJamCity)
      }
    })

     if(!playlistId){
      spotifyApi.createPlaylist(currentUser, 'city jams', { 'public' : true })
        .then(function(data) {
          console.log('Created playlist!');
          //add songs
          console.log('playlist data ', data);
          playlistId = data.body.id;
        }, function(err) {
          console.log('Something went wrong!', err);
        });
     }
     // console.log('Retrieved playlists', data.body.items[0].name);

   },function(err) {
     console.log('Something went wrong!', err);
   }).then(function(){

   })
   console.log('userID: ', currentUser)
   res.redirect('/');
 });

app.get('/hotTracks', ensureAuthenticated ,function(req, res){
  // currentUser = req._passport.session
  var spotifyId = req.query.artistId
  console.log('getHotTracks', spotifyId, 'playlistId', playlistId, 'currentUser',currentUser)
  spotifyApi.getArtistTopTracks(spotifyId, 'US')
  .then(function(data) {
    var responseArr = [];


    for(var i = 0; i < 3; i++){
      responseArr.push({
        artists: data.body.tracks[i].artists[0].name,
        song: data.body.tracks[i].name,
        album: data.body.tracks[i].album.name,
        images: data.body.tracks[i].album.images
      });

      var spotifyTrack = 'spotify:track:'
      var track = spotifyTrack + data.body.tracks[i].id
      // console.log(track)
      trackArray.push(track)
    }

    console.log(responseArr);

    spotifyApi.addTracksToPlaylist(currentUser, playlistId, trackArray)
    .then(function(data) {
      console.log('Added tracks to playlist!');
      trackArray = []
      res.status(200).json({status: 'tracks added!', arrSongsAdded: responseArr});
    }, function(err) {
      console.log('Something went wrong!', err);
    });
  }, function(err) {
    console.log('Something went wrong!', err);
  })



})


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/isAuthenticated', function(req, res, next) {
  console.log(req.session)
  var isAuth;

  if (req.isAuthenticated()) {
    isAuth = true;

  } else {
    isAuth = false;
  }
  var isAuthenticated = {
    authenticated : isAuth
  };
  res.status(200).json(isAuthenticated);

});


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
}
