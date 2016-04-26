var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/like', addLike);
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

//fonction serveur requete, resultat de la req et l'étape suivante
function addLike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;

  User.update({"mail": mail}, {$push: {tab_likes: track}}, function (err) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });

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
