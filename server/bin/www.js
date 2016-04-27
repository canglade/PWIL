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
var ml = require('./../machine_learning/musictastelearning.');
// pass passport for configuration
require('./../config/passport')(passport);

// Variables de routes
var songs = require('./../routes/songs');
var users = require('./../routes/users');
var signup = require('./../routes/signup');
var authenticate = require('./../routes/authenticate');
var memberInfo = require('./../routes/memberInfo');

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

// Server's routes
app.use('/songs', songs);
app.use('/users', users);
// connect the api routes under /api/*
app.use('/api', signup);
app.use('/api', authenticate);
app.use('/api', memberInfo);

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

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
var server = app.listen(3000, function () {
  console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});
