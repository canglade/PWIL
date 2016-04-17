var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');

router.post('/signup', signup);

function signup (req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      username: req.body.username
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
};

module.exports = router;
