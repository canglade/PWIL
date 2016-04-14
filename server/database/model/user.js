var mongoose = require('mongoose');

var user = mongoose.Schema({
  username: String,
  name: String,
  email: String
});

module.exports = mongoose.model('Users', user);
