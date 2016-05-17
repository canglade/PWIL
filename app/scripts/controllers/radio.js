'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # RadioCtrl
 * Controller of the pwilApp
 */

angular.module('pwilApp')
  .controller('RadioCtrl', function ($rootScope, $scope,$route, $sce, TAG, HISTORICAL, dbService) {
    var increment = 0;
    var laSimilaire = "";
    var styles = [];
    var historique = $rootScope.historique;

    $rootScope.activeHome = "";
    $rootScope.activeSongs = "active";
    $rootScope.activeAccount = "";
    $rootScope.activeConnection = "";

    $scope.isLoading = true;

    $scope.$on('$viewContentLoaded', function () {
      $scope.nextsong();
    });

    function loadPreview () {
      dbService.getSpotifyPreview($scope.song.title, $scope.song.artist).success(function (data) {
        if (data.body.tracks.items.length > 0) {
          $scope.preview_url = $sce.trustAsResourceUrl(data.body.tracks.items[0].preview_url);
          $scope.albumFolder = $sce.trustAsResourceUrl(data.body.tracks.items[0].album.images[1].url);
          $scope.albumName = $sce.trustAsResourceUrl(data.body.tracks.items[0].album.name)
          $scope.displayPlayer = true;
        }
        else {
          $scope.albumFolder = "images/nosongs.png";
          $scope.preview_url = "";
          $scope.displayPlayer = false;
          $scope.albumName = "";
        }
      });
    }

    //Ancienne fonction de chargement d'une chanson aléatoire
    /*$scope.loadSong = function () {
     $scope.isLoading = true;
     $scope.mesTags = [];
     dbService.randSong().success(function (data) {
     $scope.song = data;
     $scope.proposition = "aleatoire";
     loadPreview();
     $scope.isLoading = false;
     increment = 0;
     var tags = data.tags;
     var liste = tags.slice(0, 5);
     for(var i =0;i<liste.length;i++){
     liste[i] = liste[i][0];
     }
     historique.unshift([data.title, data.artist]);
     historique = historique.slice(0, HISTORICAL.number);
     window.localStorage.setItem('SONGS_HISTO', JSON.stringify(historique));
     var tagMaj = [];
     for(var j = 0 ; j < liste.length ; j++)
     {
     if (liste[j].toString().length < TAG.length)
     {
     liste[j] = firstToUpperCase(liste[j]);
     tagMaj.push(liste[j]);
     }
     }
     $scope.mesTags = tagMaj;
     $scope.historique = historique;
     });
     };*/

    //Transforme la première lettre en majuscule, utile pour l'affichage des tags
    function firstToUpperCase( str ) {
      return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

    //NextSong permet d'afficher les chansons correspondante au numéro de cluster de l'utilisateur
    $scope.nextsong = function () {
      var mail = $scope.userMail;
      increment =0;
      //On récupére son cluster
      dbService.getcluster(mail).success(function (data)
      {
        var cluster = data;
        console.log(cluster);
        //on compte le nombre de chansons correspondante à ce cluster
        dbService.countsong(cluster).success(function(nbSong)
          {
            //on appelle la fonction nextsong qui nous renvoi
            //une chanson aléatoire correspondante au cluster de l'utilisateur
            dbService.nextsong(cluster,nbSong).success(function (data1)
            {
              $scope.song = data1[0];

              //afficher la pochette de l'album
              loadPreview();
              $scope.isLoading = false;

              //Affichage sur l'interface de la liste des tags de la chanson
              var tags = data1[0].tags;
              var liste = [];
              if(tags.length >= 10) {
                for (var i = 0; i < 10; i++) {
                  liste.push(tags[i]);
                }
              }
              else
              {
                for (var i = 0; i < tags.length; i++) {
                  liste.push(tags[i]);
                }
              }
              for(var i =0;i<liste.length;i++){
                liste[i] = liste[i][0];
              }

              var tagMaj = [];
              for(var j = 0 ; j < liste.length ; j++)
              {
                if (liste[j].toString().length < TAG.length)
                {
                  liste[j] = firstToUpperCase(liste[j]);
                  tagMaj.push(liste[j]);
                }
              }
              $scope.mesTags = tagMaj;
              //mise à jour de l'historique des chansons
              historique.unshift([data1[0].title, data1[0].artist]);
              historique = historique.slice(0, 10);
              window.localStorage.setItem('SONGS_HISTO', JSON.stringify(historique));
              $scope.historique = historique;
            });
          }
        );
      });
    };

    //Fonction qui charge une chanson similaire à la courante (appelée si l'utilisateur like)
    //Si l'utilisateur like une nouvelle fois, on avance dans le tableau des similaires
    $scope.loadSimil = function () {
      $scope.loading = true;
      $scope.mesTags = [];
      dbService.similSong(laSimilaire).success(function (data) {
        if(data){
          $scope.song = data;
          $scope.proposition = "similaire";
          loadPreview();
          $scope.isLoading = false;
          var tags = data.tags;
          var liste = tags.slice(0, 5);
          for(var i =0;i<liste.length;i++){
            liste[i] = liste[i][0];
          }

          var tagMaj = [];
          for(var j = 0 ; j < liste.length ; j++)
          {
            if (liste[j].toString().length < TAG.length)
            {
              liste[j] = firstToUpperCase(liste[j]);
              tagMaj.push(liste[j]);
            }
          }
          $scope.mesTags = tagMaj;

          historique.unshift([data.title, data.artist]);
          historique = historique.slice(0, 10);
          window.localStorage.setItem('SONGS_HISTO', JSON.stringify(historique));
          $scope.historique = historique;
        }
        else{
          increment =0;
          $scope.nextsong();
        }
      });
    };

    //Fonction Like permet de:
    //Récuperer la chanson que l'utilisateur aime puis de l'inserer dans son tableau tab_like
    $scope.like = function(){
      var song = $scope.song;
      var mail = $scope.userMail;

      var data = "{ \"track_id\": " + "\"" + song.track_id + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      //On initialise la liste de tags en enlevant le poids de chaque tag
      var tabTags = [];
      if(song.tags.length < TAG.number) {
        for (var j = 0; j < song.tags.length; j++) {
          tabTags.push(song.tags[j][0]);
        }
      }else{
        for (var j = 0; j < TAG.number; j++) {
          tabTags.push(song.tags[j][0]);
        }
      }

      //On parcours les tags pour retrouver les chaines de caractère rap, rock, electro, hiphop...
      //Puis on récupère le style de la chanson dans le tableau de tags, on met à jour la chanson et l'utilisateur
      for (var i=0 ; i< tabTags.length; i++)
      {
        tabTags[i] = tabTags[i].trim();
        tabTags[i] = tabTags[i].toUpperCase();
        console.log(tabTags[i]);
        console.log(tabTags[i].indexOf("ROCK"));
        if (tabTags[i].indexOf("ROCK")!==-1){styles.push(1);}
        if(tabTags[i].indexOf("ELECTRO")!==-1 || tabTags[i].indexOf("TECHNO")!==-1 || tabTags[i].indexOf("DUBSTEP")!==-1){
          styles.push(2);
        }
        if(tabTags[i].indexOf("RAP")!==-1 || tabTags[i].indexOf("HIPHOP")!==-1 || tabTags[i].indexOf("RNB")!==-1
          || tabTags[i].indexOf("HIP-HOP")!==-1){
          styles.push(3);
        }
      }

      dbService.getTabLikes(mail).success(function (tablikes) {
        var exist = false;
        var dataStyles = "{ \"styles\": " + "\"" + styles + "\" "
          + ", \"userMail\": " + "\"" + mail + "\" } ";
        if (tablikes) {
          //chercher la chanson dans le tab_like
          for (var i = 0; i < tablikes.length; i++) {
            if (tablikes[i] == song) {
              exist = true;
              break;
            }
          }
          // si elle n'existe pas on l'ajoute dans le tab_like
          if (!exist) {
            dbService.addLike(data).success(function (data) {});
            if (styles.length != 0 )
            {dbService.addTag(dataStyles).success(function (data) {});
            }
            styles=[];
          }
        }
      });

      // Si la chanson existe dans le tab de dislike alors on la supprime
      dbService.getTabDislikes(mail).success(function (tabdislikes) {
        var exist = false;
        if (tabdislikes) {
          for (var i = 0; i < tabdislikes.length; i++) {
            if (tabdislikes[i] == song) {
              exist = true;
              break;
            }
          }
          if (exist) {
            dbService.removeSongDislike().success(function () {
            });
          }
        }
      });

      if(song.similars.length!=0){
        laSimilaire = song.similars[increment][0];
        increment = increment +1;
        $scope.loadSimil();
      }
      else
      {
        $scope.nextsong();
      }
    };

    // Fonction diversSong permet de diversifier le style musicale
    // On affiche une chanson aléatoire qui n'appartient pas aux tags de l'utilisateur
    $scope.diversSong = function () {
      var mail = $scope.userMail;
      dbService.getcluster(mail).success(function (data)
      {
        var cluster = data;
        console.log(cluster);
        dbService.countsong(cluster).success(function(nbSong)
          {
            dbService.diversSong(cluster,nbSong).success(function (data1)
            {
              $scope.song = data1[0];
              loadPreview();
              var tags = data1[0].tags;
              var liste = [];
              if(tags.length >= 10) {
                for (var i = 0; i < 10; i++) {
                  liste.push(tags[i]);
                }
              }
              else
              {
                for (var i = 0; i < tags.length; i++) {
                  liste.push(tags[i]);
                }
              }
              for(var i =0;i<liste.length;i++){
                liste[i] = liste[i][0];
              }

              var tagMaj = [];
              for(var j = 0 ; j < liste.length ; j++)
              {
                if (liste[j].toString().length < TAG.length)
                {
                  liste[j] = firstToUpperCase(liste[j]);
                  tagMaj.push(liste[j]);
                }
              }
              $scope.mesTags = tagMaj;

              historique.unshift([data1[0].title, data1[0].artist]);
              historique = historique.slice(0, 10);
              window.localStorage.setItem('SONGS_HISTO', JSON.stringify(historique));
              $scope.historique = historique;
            });
          }
        );
      });
    };

    //Fonction dislike
    // Si l'utilisateur dislike une chanson alors on vérifie qu'elle n'existe pas dans son tab_like sinon on la supprime
    // puis on l'ajoute à son tab_dislike
    $scope.dislike = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;

      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      dbService.getTabDislikes(mail).success(function (tabdislikes) {
        var exist = false;
        if (tabdislikes) {
          for (var i = 0; i < tabdislikes.length; i++) {
            if (tabdislikes[i] == song) {
              exist = true;
              break;
            }
          }

          $scope.tabdislikes = tabdislikes;
          $scope.exist= exist;

          if (!exist) {
            dbService.addDislike(data).success(function (data) {});
          }
        }
      });

      dbService.getTabLikes(mail).success(function (tablikes) {
        var exist = false;
        if (tablikes) {
          for (var i = 0; i < tablikes.length; i++) {
            if (tablikes[i] == song) {
              exist = true;
              break;
            }
          }
          if (exist) {
            dbService.removeSongLike().success(function () {
              $scope.removesonglike=exist;
              $scope.idtracksonglike=$scope.song.track_id;
            });
          }
        }
      });
      $scope.nextsong();
    };
    $scope.AuthentificatedRedirection();
  });
