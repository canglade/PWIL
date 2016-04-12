var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

//var mongoose = require('mongoose');
var Songs = require('../database/model/songs')


/* GET projects listing. */
router.get('/', function(req, res, next) {

  var query = Songs.find();
  query.limit(10);
  query.select({title:1, artist:1})


  query.exec (function(err,songs) {
    if (err)
      return next(err);
    res.json(songs);
  });


  /*Songs.find(function (err, songs) {
    if (err)
      return next(err);
    res.json(songs);
  });*/



});
/*
/* POST /projects
router.post('/', function(req, res, next) {
  Project.create(req.body, function (err) {
    if (err)
      return next(err);
    res.json(req.body);
  });
});

/* GET /projects/id
router.get('/:id', function(req, res, next) {
  Project.findById(req.params.id, function (err, projects) {
    if (err)
      return next(err);
    res.json(projects);
  });
});

/* PUT /projects/:id
router.put('/:id', function(req, res, next) {
  Project.findByIdAndUpdate(req.params.id, req.body, function (err, projects) {
    if (err)
      return next(err);
    res.json(projects);
  });
});

/* DELETE /projects/:id
router.delete('/:id', function(req, res, next) {
  Project.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err)
      return next(err);
    res.json(post);
  });
});*/

module.exports = router;
