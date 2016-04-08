var http = require('http');
var url = require('url');
// Inclusion de Mongoose
var mongoose = require('mongoose');

// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect('mongodb://localhost/playlist', function(err) {
  if (err) { throw err; }
});

//crée un subSchéma pour le tableau de similaires
var similSchema = new mongoose.Schema({id:String, percent:Number});

//On crée le schéma de la base
var songSchema = new mongoose.Schema({
  _id : String,
  artist : String,
  timestamp : String,
  //similars : [similSchema]
  similars : [String],
  tags : [String],
  track_id : String,
  title : String
});

//on identifie la collection songs
var songs = mongoose.model('songs', songSchema);

//création de la fonction qui retourne les similaires
function getSimilaires() {
  var resultat = [];
  //requete qui renvoit l'artiste, le titre et les similaires des 3 premières chansons
  songs.find().select({artist: 1, title: 1, similars: 1}).limit(3).exec(function (err, chansons) {

    //Pour chaque chanson
    for (var i = 0, l = chansons.length; i < l; i++) {
      var chanson = chansons[i];

      var res=[];
      var simils = chanson.similars;

      //on récupère l'id de chaque similaire et on le met dans res
      for (var k = 0, longueur = simils.length; k < longueur; k++) {
        var tab = simils[k];
        res.push(tab.substr(0, 18));

      }
      //on met res dans resultat
      resultat.push(res);

    }
  })
  return resultat;
}

//On affiche le tableau
var tableau = getSimilaires();
console.log(tableau);
