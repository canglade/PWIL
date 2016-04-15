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
  date : { type : String, required:true},
  mail : { type : String, unique : true, required:true},
  password : { type : String, required:true},
  sexe : {type : String, required:true},
  tab_likes : [Likes],
  tab_tags : [Tags],
  tab_histo : [Histo]
});

module.exports = mongoose.model('Users', users);
