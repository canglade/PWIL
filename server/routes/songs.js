var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'fcecfc72172e4cd267473117a17cbd4d',
  clientSecret : 'a6338157c9bb5ac9c71924cb2940e1a7',
  redirectUri : 'http://www.example.com/callback'
});

//var mongoose = require('mongoose');
var Songs = require('../database/model/songs');

router.get('/', getAllSongs);
router.get('/diversSong', diversSong);
router.get('/nextsong', nextsong);
router.get('/countsong', countsong);
router.get('/rand', getRandSong);
router.get('/simil', getSimilSong);
router.get('/preview', getSpotifyPreview);

/* GET projects listing. */
function getAllSongs (req, res, next) {

  var query = Songs.find();
  query.limit(10);
  query.select({title:1, artist:1});

  query.exec (function(err,songs) {
    if (err)
      return next(err);
    res.json(songs);
  });
};
/* Get Random Song */
function getRandSong (req, res, next) {
  Songs.findOneRandom(function(err,song){
    if (err)
      return next(err);
    res.json(song);
  });
};

/* Get Similar Song */
function getSimilSong (req, res, next) {
  //console.log("Ma similaire : " + req.headers.track_id);
  Songs.findOne({"track_id": req.headers.track_id}, function (err, song) {
    if (err)
      return next(err);
    res.json(song);
  });
};

function getSpotifyPreview (req, res, next) {
  // Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
  spotifyApi.searchTracks('track:'+req.headers.track+' artist:'+req.headers.artist)
    .then(function(data) {
      res.json(data);
      //console.log('Search tracks', data.body.tracks.items[0].album.images[1].url);
      //console.log('Search tracks', data.body.tracks.items[0].preview_url);
    }, function(err) {
      console.log('Something went wrong!', err);
    });
};

/* Count the number of song according to the number of cluster */
function countsong (req, res, next) {
  //cherche une musique du meme tag que la précédente (aprés avoir cliquer sur le bouton next)
  //console.log(req.headers.numcluster);
  var numcluster = parseInt(req.headers.numcluster);
  var queryCount = Songs.find({"tag":numcluster}).count();

  queryCount.exec(function (err, songs) {
    if (err)
      return next(err);
    res.json(songs);
  });
};

/* Play the Next song similar to the previous one , same style */
function nextsong (req, res, next) {
  //cherche une musique du meme tag que la précédente (aprés avoir cliquer sur le bouton next)
  var numcluster = parseInt(req.headers.numcluster);
  var query = Songs.find({"tag":numcluster});

  console.log(req.headers.nbsong);
  var nbsong = parseInt(req.headers.nbsong);
  query.limit(1).skip(Math.floor(Math.random()*nbsong));
  
  query.exec (function(err,songs) {
    if (err)
      return next(err);
    res.json(songs);
  });

};

/* Play a different style song */
function diversSong (req, res, next) {
  //cherche une musique du meme tag que la précédente (aprés avoir cliquer sur le bouton next)
  var numcluster = parseInt(req.headers.numcluster);
  var query = Songs.find({"tag":{$ne:numcluster}});

  console.log(req.headers.nbsong);
  var nbsong = parseInt(req.headers.nbsong);
  query.limit(1).skip(Math.floor(Math.random()*nbsong));

  query.exec (function(err,songs) {
    if (err)
      return next(err);
    res.json(songs);
  });
};

module.exports = router;
