var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/users');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/', addLike);

/* GET users listing. */
function getAllUsers(req, res, next) {
  User.find(function (err, users) {
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

/* POST /users */
function addLike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  var track = req.body.track_id;
  User.update({"nom" : "test"}, {$push:{tab_like:"track"}}, function(err){
    if (err) return next(err);
  });
};


module.exports = router;
