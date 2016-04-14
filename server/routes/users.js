var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');

router.get('/', getAllUsers);
router.post('/', createUser);

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


module.exports = router;
