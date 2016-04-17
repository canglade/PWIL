var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/', addLike);

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

function addLike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$push:{tab_likes:track}}, function(err){
    if (err) return next(err);
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
