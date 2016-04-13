var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Users = require('../database/model/users')


/* GET projects listing. */
router.get('/', function(req, res, next) {

  var query = Users.find();
  query.limit(10);

  query.exec (function(err,users) {
    if (err)
      return next(err);
    res.json(users);
  });
});

module.exports = router;
