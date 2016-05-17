var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var _ = require('lodash');
var bcrypt = require('bcryptjs');
var User = require('../database/model/user');
var Songs = require('../database/model/songs');
var nbCluster = require('../config/machineLearning');

router.get('/', getAllUsers);
router.get('/getcluster', getcluster);
router.post('/', createUser);
router.put('/like', addLike);
router.put('/addTag', addTag);
router.put('/dislike', addDislike);
router.get('/tablikes', songExist);
router.get('/tabdislikes', songDislikeExist);
router.put('/removesongDislike', removeSongFromTabDislike);
router.put('/removesongLike', removeSongFromTablike);
router.get('/email/free', isUserMailFree);
router.put('/reinit', reinit);
router.get('/getTabTags', getTabTags);

/* GET users listing. */
function getAllUsers(req, res, next) {
  var query = User.find();
  query.limit(10);

  query.exec (function(err,users) {
    if (err)
      return next(err);
    res.json(users);
  });
};

/* POST /users */
function createUser(req, res, next) {
  User.findOne({"mail" : req.body.mail}, function(err, user){
    if (err) return next(err);
    if (user) {
      // username already exists
      next(new Error("Ce mail est déjà utilisé : " + req.body.mail));
    } else {
      createUs();
    }
  });

  function createUs(){
    var user = _.omit(req.body);

    User.create(user, function (err) {
      if (err)
        return next(err);
      // On retourne le body de la réponse
      res.json(req.body);
    });
  }
};

function songExist(req, res, next) {
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    console.log("mail : " + req.headers.mail);
    res.json(user.tab_likes);
  });
};

function songDislikeExist(req, res, next) {
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    console.log("mail : " + req.headers.mail);
    res.json(user.tab_dislikes);
  });
};

function isUserMailFree(req, res, next) {
  var success = false;
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    if (user) {
      success = false;
    }
    else {
      success = true;
    }
    res.json(success);
  });
};

//fonction d'ajout de like pour l'utilisateur
function addLike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;
  
//récupère l'utilisateur
  User.findOne({"mail": mail}, function (err, user) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    console.log("Mon cluster : " + user.cluster);
    updateUser(user.mail);
    updateSong(track,user.cluster);
    res.json(req.body);
  });

  //mise à jour du tableau de likes (on ajoute le track_id de la chanson qu'il a liké)
  function updateUser(mail){
    User.update({"mail": mail}, {$push: {tab_likes: track}}, function (err) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON
    });
  }

  //fonction d'update de la chanson (on met à jour le tableau de like pour dire à la chanson : 
  //"un utilisateur du cluster X t'a liké"  => tab_likes(0,10,20)
  function updateSong(track, cluster){
    Songs.findOne({"track_id": track}, function (err, song) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON

      var likes = song.tab_like;

      if(likes.length !== nbCluster){
        var newSize = nbCluster-likes.length;
        for(var i = 0;i<newSize;i++){
          likes.push(0);
        }
      }
      likes[cluster] = likes[cluster] + 1;

      console.log("Mon tag :" + likes);

      updateLikesSong(track,likes);
      updateClusterSong(track,likes);
    });

  }

  function updateLikesSong(track, tag){
    Songs.update({"track_id": track}, {$set: {tab_like: tag}}, function (err) {
      if (err) return next(err);
      console.log("Update :" + track + " " +tag);
      // NE PAS SUPPRIMER BUG SINON
    });
  }
  
  //Mise à jour du cluster de la chanson 
  function updateClusterSong(track, likes) {
    var somme = 0;
    var seuil = 100/nbCluster;
    seuil = Math.trunc(seuil);
    console.log("seuil :" + seuil);
    var choix = [];
    for(var i =0;i<likes.length;i++){
      somme = somme + likes[i];
    }
    //Si on a au moins 100 likes au total sur cette chanson :
    if(somme > 100){
      console.log("Track : " + track + " Likes : " + likes);
      for(var i = 0;i<likes.length;i++){
        var pourcentage = (likes[i]/somme)*100;
        pourcentage = Math.trunc(pourcentage);
        console.log(pourcentage);
        //Pour chaque nombre de likes d'un cluster, si la valeur est supérieure au seuil fixé, alors on ajoute ce cluster 
        //dans la liste des clusters possibles pour cette chanson => tab_tags(numCluster,numCluster,numCluster)
        if(pourcentage>=seuil){choix.push(i);}
      }
      Songs.update({"track_id": track}, {$set: {tag: choix}}, function (err) {
        if (err) return next(err);
        // NE PAS SUPPRIMER BUG SINON
      });
    }
  }

};

//Fonction de dislike qui ajoute le track_id dans le tab_dislike de l'utilisateur
function addDislike(req, res, next) {
  console.log("chanson : " + req.body.track_id);
  console.log("mail : " + req.body.userMail);
  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$push:{tab_dislikes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};

//On regarde les tags renvoyés depuis la chanson. On incrémente la valeur du tableau de l'utilisateur correspond au style liké
// tab_like(0,5,32) j'ai aimé 0 rock 5 rap 32 electro
function addTag(req, res, next) {
  var mail = req.body.userMail;
  var tags = req.body.styles.split(",");

  User.findOne({"mail": mail}, function (err, user) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON

    var rock =user.tab_tags[0];
    var electro = user.tab_tags[1];
    var rap =user.tab_tags[2];

    for(var i = 0;i < tags.length;i++){
      if(tags[i] == 1){rock++}else if(tags[i]==2){electro++}else{rap++};
    }
    updateUser([rock,electro,rap]);
  });

  function updateUser(tags){
    console.log(tags);
    User.update({"mail": mail}, {$set: {tab_tags:tags}}, function (err) {
      if (err) return next(err);
      // NE PAS SUPPRIMER BUG SINON

      res.json(req.body);
    });
  }
};

function removeSongFromTabDislike(req, res, next) {

  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$pull:{tab_dislikes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};

function removeSongFromTablike(req, res, next) {

  var track = req.body.track_id;
  var mail = req.body.userMail;
  User.update({"mail" : mail}, {$pull:{tab_likes:track}}, function(err){
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON
    res.json(req.body);
  });
};

function getcluster(req, res, next) {
  console.log("mail" + req.headers.mail);
  User.findOne({"mail" : req.headers.mail}, function(err, user){
    if (err) return next(err);
    res.json(user.cluster);
  });
};

function reinit (req, res, next) {
  User.update({"mail": req.body.mail}, {$set: {tab_likes:[], tab_dislikes: [], tab_tags : [0,0,0], old_cluster : -1}}, function (err) {
    if (err) return next(err);
    // NE PAS SUPPRIMER BUG SINON

    res.json("Success");
  });
}

function getTabTags (req, res, next) {
  User.findOne({"mail" : req.headers.mail}, {"tab_tags" : 1}, function(err, user){
    if (err) return next(err);
    res.json(user.tab_tags);
  });
}

module.exports = router;
