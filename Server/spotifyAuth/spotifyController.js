

var keys = require('../keys.js'),
    hasJamCity = false;

module.exports = function (app, express, passport, spotifyApi) {
  var clientID = keys.clientID ;
  var clientSecret = keys.clientSecret;
  var User;
  var currentUser;
  var playlistId;
  var trackArray = [];




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
console.log('res ', res);
});


// GET /auth/spotify/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }), function(req, res) {
    currentUser = res.req.user.id

    // console.log('req session obj ', req.session);
    //find if JamCity playlist exists
    //create if not there
    spotifyApi.getUserPlaylists(currentUser)
    .then(function(data) {
     bigD = data.body.items

     bigD.forEach(function(item){
      // console.log('playlistName', item.name)
      if(item.name === 'city jams'){
        console.log('city jams exists');
        playlistId = item.id;
        console.log(playlistId);
        req.session.playlistId = playlistId;
        console.log("this is the playlist Id", req.session.playlistId)

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
          req.session.playlistId = playlistId;

        }, function(err) {
          console.log('Something went wrong!', err);
        });
    }
     // console.log('Retrieved playlists', data.body.items[0].name);

   },function(err) {
     console.log('Something went wrong!', err);
   }).then(function(){

   })
   res.redirect('/');
 });

app.get('/hotTracks', ensureAuthenticated ,function(req, res){
  // currentUser = req._passport.session
  // var playlistId = req.session.playlistId
  // console.log("playlist ID",req.session)
  var spotifyId = req.query.artistId
  console.log('getHotTracks', spotifyId, 'playlistId', playlistId)
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
      trackArray.push(track)
    }

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
    console.log('req sessopm ',req.session);
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
