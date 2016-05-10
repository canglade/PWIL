var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var nbCluster = require('../../config/machineLearning');

var Tags = new mongoose.Schema({
  style : {type:String},
  freq : {type:Number}
});

var Similaires = new mongoose.Schema({
  track_id : {type:String},
  poids : {type:Number}
});

var init_Like = [];

for(var i = 0;i<nbCluster;i++){
  init_Like.push(0);
}

// Création du schéma pour les musiques
var songs = new mongoose.Schema({
  id : String,
  artist : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  timestamp : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  similars : [Similaires],
  tags : [Tags],
  track_id : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  title : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
  tab_like : {type : [Number], default: init_Like},
});

songs.plugin(random);

module.exports = mongoose.model('Songs', songs);
