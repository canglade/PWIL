var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');
var config = require('./../config/database');
var jwt = require('jwt-simple');

router.get('/memberinfo', memberInfo);
router.put('/update/user', update);
router.put('/update/user/password', updatePassword);

function memberInfo (req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      username: decoded.username
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // Code de Robin
        // res.json({success: true,
        //   msg: 'Welcome in the member area ' + user.username + '!',
        //   user: user});
        res.json({success: true, user: user});
      }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
};

function update (req, res) {
  User.update({"mail": req.body.mail}, {"mail" : req.body.newmail, "firstname": req.body.firstname, "lastname": req.body.lastname, "username": req.body.username, "birthdate": req.body.birthdate}, function (err) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json("Success")
  });
};

function updatePassword (req, res) {
  var password = req.body.password;
  if ( typeof password !== 'undefined' && password ) {
    bcrypt.genSalt(10, function (err, salt) {

      bcrypt.hash(password, salt, function (err, hash) {

        password = hash;
        console.log('pwd : '+req.body.password+' VS '+hash);

        User.update({"mail": req.body.mail}, {"password": password}, function (err) {
          if (err) return next(err);
          res.json("Success")
        });
      });
    });
  }
};

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
