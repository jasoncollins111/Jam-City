var keys = require('../keys.js'),
    Promise = require("bluebird"),
    hasJamCity = false;

function getPlaylist(spotifyClient, currentUser) {
    return spotifyClient.getUserPlaylists(currentUser)
        .then(function(data) {
            var playlistId;
            bigD = data.body.items;
            bigD.forEach(function(item, key) {
                if (item.name === 'Jamm-City') {
                    playlistId = item.id;
                }
            });
            return playlistId || createJammCityPlayList(spotifyClient, currentUser);
        })

}

function createJammCityPlayList(spotifyClient, currentUser) {
    return spotifyClient.createPlaylist(currentUser, 'Jamm-City', {
            'public': true
        })
        .then(function(data) {
            playlistId = data.body.id;
            return playlistId
        });
}

function addToJammCityPlaylist(spotifyClient, currentUser, trackArray, id) {
    return spotifyClient.addTracksToPlaylist(currentUser, id, trackArray);
}

function getArtistTopTracks(spotifyClient, spotifyId) {
    return spotifyClient.getArtistTopTracks(spotifyId, 'US')
        .then(function(data) {
            var trackArray = [];
            var tracks = data.body.tracks;
            for (var i = 0; i < tracks.length; i++) {
                var trackUrl = 'spotify:track:' + data.body.tracks[i].id;
                trackArray.push(trackUrl);
                if (i === 2) {
                    break;
                }
            }

            return trackArray;
        });
}

function getArtist(spotifyClient, spotifyId) {
    return spotifyClient.getArtist(spotifyId)
        .then(function(data) {
            return data.body;
        });
}


module.exports = function(app, express, passport, spotifyApi, userInfo) {
    var clientID = keys.clientID;
    var clientSecret = keys.clientSecret;




    app.get('/auth/spotify',
        passport.authenticate('spotify', {
            scope: ['user-read-email', 'user-read-private', 'playlist-modify-public'],
            showDialog: true
        }),
        function(req, res) {});

    app.get('/callback',
        passport.authenticate('spotify', {
            failureRedirect: '/login'
        }), function(req, res) {
            res.redirect('/jamCity.html');
        });

    app.get('/getArtist', ensureAuthenticated, function(req, res) {
        spotifyId = req.query.artistId;
        getArtist(spotifyApi, spotifyId)
            .then(function(info) {
                if (info.images.length > 0) {
                    res.status(200).json({
                        status: 'found your pic bruh',
                        image: info.images[0].url
                    })
                } else {
                    console.log('error');
                    res.status(400).json({
                        status: 'could not find picture'
                    })
                }
            })
            .catch(function(err) {
                res.status(400).json({
                    status: 'not a spotify artist'
                })
            })
    })

    app.get('/hotTracks', ensureAuthenticated, function(req, res) {
        var spotifyId = req.query.artistId;
        var currentUser = res.req.user.id;
        var tasks = [getPlaylist(spotifyApi, currentUser), getArtistTopTracks(spotifyApi, spotifyId)];
        Promise.all(tasks)
            .then(function(fufillmentValues) {
                var playlistId = fufillmentValues[0];
                var tracksArr = fufillmentValues[1];
                if (tracksArr.length === 0) {
                    console.log('zero songs');
                    res.status(400).json({
                        status: ':( didnt add tracks'
                    });
                } else {
                    return addToJammCityPlaylist(spotifyApi, currentUser, tracksArr, playlistId)
                }
            })
            .then(function(data) {
                console.log('tracks added');
                res.status(200).json({
                    status: 'tracks added!'
                });
            })
            .catch(function(err) {
                console.log('didnt add tracks');
                res.status(400).json({
                    status: ':( didnt add tracks'
                });
            })
    })


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/isAuthenticated', function(req, res, next) {
        var isAuth;
        userInfo.session = req.session;
        console.log('is authenticated', req.session);

        if (req.isAuthenticated()) {
            isAuth = true;
        } else {
            isAuth = false;
            res.redirect('/')
        }
        var isAuthenticated = {
            authenticated: isAuth
        };
        res.status(200).json({isAuthenticated, userInfo});

    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    }
}