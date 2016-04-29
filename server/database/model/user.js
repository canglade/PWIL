var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// Création du schéma pour les utilisateurs
/*var Likes = new mongoose.Schema({
  track_id : {type:String},
  freq : {type:Number}
});*/

var Tags = new mongoose.Schema({
  style : {type:String},
  freq : {type:Number}
});

var Histo = new mongoose.Schema({
  track_id : {type:String},
  freq : {type:Number}
});

// set up a mongoose model
/*var UserSchema = new Schema({
 name: {
 type: String,
 unique: true,
 required: true
 },
 password: {
 type: String,
 required: true
 }
 });*/

var user = new mongoose.Schema({
  id : String,
  firstname : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  lastname : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  mail : { type : String},
  password : { type : String},
  username: String,
  birthdate : { type : Date},
  tab_likes : [String],
  tab_dislikes : [String],
  tab_tags : [String],
  tab_histo : [Histo]
});

user.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

user.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', user);
