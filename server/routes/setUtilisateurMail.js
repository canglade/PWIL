/**
 * Created by Christophe on 13/04/2016.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Users = require('../database/model/users')

// POST /users
router.post('/:mail', function(req, res, next) {
  Users.insert(req.body, function (err) {
    if (err)
      return next(err);
    res.json(req.body);
  });
});

module.exports = router;
