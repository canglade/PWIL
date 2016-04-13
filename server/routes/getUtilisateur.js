/**
 * Created by Christophe on 13/04/2016.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Users = require('../database/model/users')

router.get('/:mail', function(req, res, next) {
  var query = Users.findOne({'mail' : req.params.mail});
  query.exec (function(err,users) {
    if (err)
      return next(err);
    res.json(users);
  });
});

module.exports = router;
