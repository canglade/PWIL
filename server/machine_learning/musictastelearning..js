var express = require('express');
var nbCluster = require('../config/machineLearning');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');
var Songs = require('../database/model/songs');
var ml = require('machine_learning');
var math = require('mathjs');
var utilisateurs = [];

// function updateModelUser() {
//   User.find(function(err,users){
//     if (err)
//       return next(err);
//     if(users[0].tab_tags.length != nbCluster){
//       for(var i = 0;i<users.length;i++){
//         updateTab(users[i], users[i].tab_tags);
//       }
//     }
//   });
//
//   function updateTab(user, tags){
//     var oldSize = tags.length;
//     var newSize = nbCluster - oldSize;
//     for(var i = 0; i<newSize;i++){
//       tags.push(0);
//     }
//     User.update({mail:user.mail},{$set: {tab_tags:tags}}, function (err) {
//       if (err) return next(err);
//     });
//   }
// };
//
// updateModelUser();

//fonction de clustering
function clustering() {
  var query = User.find(null);
// on récupère tous les utilisateurs
  query.exec(function (err, users) {
    if (err) { throw err; }
    //Pour chacun, on récupère ses tags
    for (var i = 0, l = users.length; i < l; i++) {
      //var tags = [];
      utilisateurs.push(users[i].tab_tags);
      //utilisateurs.push(tags);
      console.log("Utilisateur " + i + " : " + users[i].tab_tags);
    }
    //on appelle l'algo de ML
    var clusters = machineLearning();
    //On met à jour les utilisateurs dans la base
    for(var i = 0; i<clusters.length;i++){
      for(var j = 0; j<clusters[i].length;j++){
        var indice = clusters[i][j];
        updateUser(users[indice].username,i);
      }
    }
  });
  //Fonction de ML qui retourne les clusters pour chaque utilisateur
  function machineLearning(){
    //Standardisation des données

    //initialisation des tableaux
    var tableauValeurs = [];
    var tableauMoyennes = [];
    var tableauStd = [];

    for(var i = 0;i<nbCluster;i++) {
      tableauValeurs.push([]);
      tableauMoyennes.push(0);
      tableauStd.push(0);
    }

    //initialisation des valeurs
    for(var j = 0;j<nbCluster;j++){
      for(var i = 0; i<utilisateurs.length; i++) {
        tableauValeurs[j].push(utilisateurs[i][j]);
      }
    }

    for(var i = 0;i<nbCluster;i++){
      tableauMoyennes[i] = math.mean(tableauValeurs[i]);
      tableauStd[i] = math.std(tableauValeurs[i]);
    }

    for(var i = 0; i< utilisateurs.length;i++) {
      for(var j = 0;j<nbCluster;j++){
        utilisateurs[i][j] = ((utilisateurs[i][j] - tableauMoyennes[j]) / tableauStd[j]);
      }
      console.log("Utilisateur " + i + " : " + utilisateurs[i]);
    }

    //Appel du Kmeans
    var result = ml.kmeans.cluster({
      data : utilisateurs,
      k : 3, // Nombre de Clusters
      epochs: 500, // Limite du nombre de boucle
      init_using_data : true, // Les données  initiales des clusters sont prisent aléatoirement si True
      distance : {type : "pearson"}
    });
    console.log("clusters : ", result.clusters);
    console.log("Moyennes : ", result.means);

    return result.clusters;
  }
  //Fonction de mise à jour
  function updateUser(username, cluster){

    User.findOne({"username": username}, function (err, user) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON
      if(user.old_cluster == -1){
        updateClusters(username,cluster);
      }
      else{
        if(cluster !== user.old_cluster){
          //mise à jour des songs
          console.log("On change de cluster");

          for(var i = 0;i < user.tab_likes.length;i++){
            updateSongs(user.tab_likes[i], cluster, user.old_cluster);
          }

          //Puis on met à jour le cluster
          updateClusters(username,cluster);

        }
      }
      console.log("Utilisateur :" + username + " Cluster : " + cluster);
    });

    function updateClusters(username, cluster){
      User.update({"username": username},{$set: {old_cluster: cluster}}, function (err) {
        if (err) return next(err);
        updateNewCluster(username,cluster);
        // NE PAS SUPPRIMER BUG SINON
      });
    }

    function updateNewCluster(username, cluster){
      User.update({username:username}, {$set:{cluster:cluster}}, function (err) {
        if (err) {
          console.log("erreur");
          return next(err);
        }
      });
    }

    function updateSongs(track, cluster, old_cluster){
        Songs.findOne({"track_id": track}, function (err, song) {
          if (err) return next(err);
          // NE PAS SUPPRIMER BUG SINON

          var likes = song.tab_like;
          likes[old_cluster] = likes[old_cluster] - 1;
          likes[cluster] = likes[cluster] + 1;

          updateLikesSong(track,likes);
        });
    }

    function updateLikesSong(track, likes){
      Songs.update({"track_id": track}, {$set: {tab_like: likes}}, function (err) {
        if (err) return next(err);
        // NE PAS SUPPRIMER BUG SINON
      });
    }

  }

};

clustering();
//module.exports = result;
