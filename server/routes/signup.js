var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');

router.post('/signup', signup);

function signup (req, res) {
  if (!req.body.mail || !req.body.password) {
    res.json({success: false, msg: 'Veuillez entrer un mail et un mot de passe.'});
  } else {
    var newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      username: req.body.username,
      birthdate: req.body.birthdate
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Cet email est déjà utilisé.'});
      }
      res.json({success: true, msg: 'Utilisateur créer avec succès.'});
    });
  }
};

module.exports = router;
