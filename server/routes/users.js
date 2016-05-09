var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');
var Songs = require('../database/model/songs');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/like', addLike);
router.put('/addTag', addTag);
router.put('/dislike', addDislike);
router.get('/tablikes', songExist);
router.get('/tabdislikes', songDislikeExist);
router.put('/removesongDislike', removeSongFromTabDislike);
router.put('/removesongLike', removeSongFromTablike);

/* GET users listing. */
function getAllUsers(req, res, next) {
  var query = User.find();
  query.limit(10);

  query.exec (function(err,users) {
    if (err)
      return next(err);
    res.json(users);
  });
};

/* POST /users */
function createUser(req, res, next) {
  User.findOne({"username" : req.body.username}, function(err, coll){
    if (err) return next(err);
    if (coll) {
      // username already exists
      next(new Error("Ce pseudo est déjà utilisé : " + req.body.username));
    } else {
      createUs();
    }
  });

  function createUs(){
    var user = _.omit(req.body);

    User.create(user, function (err) {
      if (err)
        return next(err);
      // On retourne le body de la réponse
      res.json(req.body);
    });
  }
};

function songExist(req, res, next) {
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    console.log("mail : " + req.headers.mail);
    res.json(user.tab_likes);
  });
};




function songDislikeExist(req, res, next) {
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    console.log("mail : " + req.headers.mail);
    res.json(user.tab_dislikes);
  });
};

//TODO : Update l'utilisateur et la chanson au moment du like
//fonction serveur requete, resultat de la req et l'étape suivante
function addLike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;


  User.findOne({"mail": mail}, function (err, user) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    console.log("Mon cluster : " + user.cluster);
    updateUser(user.mail);
    updateSong(track,user.cluster);
    res.json(req.body);
  });

  function updateUser(mail){
    User.update({"mail": mail}, {$push: {tab_likes: track}}, function (err) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON
    });
  }

  //fonction d'update de la chanson
  function updateSong(track, cluster){
    Songs.findOne({"track_id": track}, function (err, song) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON

      var likes = song.tab_like;
      likes[cluster] = likes[cluster] + 1;

      console.log("Mon tag :" + likes);

      updateLikesSong(track,likes);
    });

  }

  function updateLikesSong(track, tag){
    Songs.update({"track_id": track}, {$set: {tab_like: tag}}, function (err) {
      if (err) return next(err);
      console.log("Update :" + track + " " +tag);
      // NE PAS SUPPRIMER BUG SINON
    });
  }
};

function addDislike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$push:{tab_dislikes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};


function addTag(req, res, next) {
  var mail = req.body.userMail;
  var tags = req.body.styles.split(",");

  User.findOne({"mail": mail}, function (err, user) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON

    var rock =user.tab_tags[0];
    var electro = user.tab_tags[1];
    var rap =user.tab_tags[2];

    for(var i = 0;i < tags.length;i++){
      if(tags[i] == 1){rock++}else if(tags[i]==2){electro++}else{rap++};
    }
      updateUser([rock,electro,rap]);
  });

  function updateUser(tags){
    console.log(tags);
    User.update({"mail": mail}, {$set: {tab_tags:tags}}, function (err) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON

      res.json(req.body);
    });
  }
};

function removeSongFromTabDislike(req, res, next) {

  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$pull:{tab_dislikes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};

function removeSongFromTablike(req, res, next) {

  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$pull:{tab_likes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};
/*function insertTest(req, res, next) {
  User.insert(req.body, function (err) {
    if (err)
      return next(err);
    res.json(req.body);
  });
};

function getUserByMail(req, res, next) {
  var query = Users.findOne({'mail' : req.params.mail});
  query.exec (function(err,users) {
    if (err)
      return next(err);
    res.json(users);
  });
};*/

module.exports = router;
