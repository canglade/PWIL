/**
 * Created by Christophe on 13/04/2016.
 */
var mongoose = require('mongoose');

// Création du schéma pour les utilisateurs
var Likes = new mongoose.Schema({
  track_id : {type:String},
  freq : {type:Number}
});

var Tags = new mongoose.Schema({
  style : {type:String},
  freq : {type:Number}
});

var Histo = new mongoose.Schema({
  track_id : {type:String},
  freq : {type:Number}
});

var users = new mongoose.Schema({
  id : String,
  nom : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  prenom : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  date : { type : Date},
  mail : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  password : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  tab_likes : [Likes],
  tab_tags : [Tags],
  tab_histo : [Histo]
});

module.exports = mongoose.model('users', users);
