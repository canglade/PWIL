var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport	= require('passport');
var jwt = require('jwt-simple');
var config = require('./../config/database'); // get db config file
var ml = require('./../machine_learning/musictastelearning');
var configMl = require('../config/machineLearning');
var cluster = require('./../routes/cluster');

require('./../config/passport')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(cors());

app.use('/cluster', cluster);

var timeToCalculateClusters = configMl.timeToCalculateClusters;

function callClustering() {
  ml.clustering();
  setTimeout( callClustering, timeToCalculateClusters ); // 1sec=1000
}

callClustering();

// Connexion BDD Mongo avec module mongoose
var mongoose = require('mongoose');

//mongoose.connect(config.connectionString, function(err) {
mongoose.connect(config.database, function(err) {
  if(err) {
    console.log('Connection error !', err);
  } else {
    console.log('Connection successful  !');
  }
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

// start server
var server = app.listen(3001, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
