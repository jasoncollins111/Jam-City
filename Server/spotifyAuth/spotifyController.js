

var keys = require('../keys.js'),
hasJamCity = false;

function getPlaylist(spotifyClient, currentUser, cb) {
 var playlistId;
 spotifyClient.getUserPlaylists(currentUser)
 .then(function(data) {
   bigD = data.body.items
   bigD.forEach(function(item, key){
    if(item.name === 'Jamm-City'){
      playlistId = item.id;
    }
  });

  cb(null, playlistId);
},function(err) {
  console.log('Something went wrong! 19', err);
  cb(err, null);
});

}

function createJammCityPlayList(spotifyClient, currentUser, cb){
  spotifyClient.createPlaylist(currentUser, 'Jamm-City', { 'public' : true })
  .then(function(data) {
    playlistId = data.body.id;

    cb(null, playlistId);
  }, function(err) {
    console.log('Something went wrong! 32', err);
    cb(err, null);
  });
}

function addToJammCityPlaylist(spotifyClient, currentUser, trackArray, id, cb){
  spotifyClient.addTracksToPlaylist(currentUser, id, trackArray)
  .then(function(data) {
      cb(null, data);
    }, function(err) {
        console.log('Something went wrong! 42', err);
      cb(err, null);
    });
}

function getArtistTopTracks (spotifyClient, spotifyId, cb){
  spotifyClient.getArtistTopTracks(spotifyId, 'US')
  .then(function(data) {
    var trackArray = [];

    for(var i = 0; i < data.body.tracks.length; i++){
      var trackUrl = 'spotify:track:' + data.body.tracks[i].id;
      trackArray.push(trackUrl);
      if(i === 2){
        break;
      }
    }

    cb(null, trackArray);
  }, function(err){
    console.log('Something went wrong! 62', err);

    cb(err, null);
  });
}





module.exports = function (app, express, passport, spotifyApi) {
  var clientID = keys.clientID ;
  var clientSecret = keys.clientSecret;

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
    res.redirect('/jamCity.html');
  });

app.get('/hotTracks', ensureAuthenticated ,function(req, res){
  var spotifyId = req.query.artistId;
  var currentUser = res.req.user.id;
  getArtistTopTracks(spotifyApi, spotifyId, function(err, tracksArr){
    if(err){
      console.log('dafuq? in getArtistTopTracks', err);
      console.log('dafuq?', err);
      res.status(400).json({status: ':( didnt add tracks'});
    } else{
      if(tracksArr.length === 0){
        console.log('zero songs');
        res.status(400).json({status: ':( didnt add tracks'});
      } else {
        getPlaylist(spotifyApi, currentUser, function(err, playlistId){
          if(err){
            console.log('err - couldnt find playlist ', err);
            res.status(400).json({status: ':( didnt add tracks'});
          } 

          if(playlistId === undefined){
            //create playlist
            createJammCityPlayList(spotifyApi, currentUser, function(err, playlistId){
              if(err){
                console.log('err - couldnt create playlist ', err);
                res.status(400).json({status: ':( didnt add tracks'});
              } 
              addToJammCityPlaylist(spotifyApi, currentUser, tracksArr, playlistId, function(err, music){
                if(err){
                  console.log('err - couldnt add to playlist ', err);
                  res.status(400).json({status: ':( didnt add tracks'});
                }
                res.status(200).json({status: 'tracks added!'});
              })
            })
          } 

          addToJammCityPlaylist(spotifyApi, currentUser, tracksArr, playlistId, function(err, music){
              if(err){
                console.log('err - couldnt add to playlist ', err);
                res.status(400).json({status: ':( didnt add tracks'});
              }
              res.status(200).json({status: 'tracks added!'});
          })
        })
      }
    }
  })
})


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

app.get('/isAuthenticated', function(req, res, next) {
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
