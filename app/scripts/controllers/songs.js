'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */

angular.module('pwilApp')
  .controller('SongsCtrl', function ($rootScope, $scope,$route, $sce, serviceDb) {
    var increment = 0;
    var laSimilaire = "";
    var styles = [];

    $rootScope.activeHome = "";
    $rootScope.activeSongs = "active";
    $rootScope.activeAccount = "";
    $rootScope.activeContacts = "";
    $rootScope.activeAbout = "";
    $rootScope.activeConnection = "";

    $scope.currentPage = 1;
    $scope.totalPages = 0;
    $scope.isLoading = true;

    $scope.$on('$viewContentLoaded', function () {
      $scope.loadSong();
    });

    $scope.loadPreview = function () {
      serviceDb.getSpotifyPreview($scope.song.title, $scope.song.artist).success(function (data) {
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
        }
      });
    }

    $scope.loadSong = function () {
      $scope.isLoading = true;
      $scope.mesTags = [];
      serviceDb.randSong().success(function (data) {
        $scope.song = data;
        $scope.proposition = "aleatoire";
        $scope.loadPreview();
        $scope.isLoading = false;
        increment = 0;
        var tags = data.tags;
        var liste = tags.slice(0, 5);

        $scope.mesTags = liste;
      });
    };


    $scope.nextsong = function () {
      var mail = $scope.userMail;
      serviceDb.getcluster(mail).success(function (data)
      {
        var cluster = data;
        console.log(cluster);
          serviceDb.countsong(cluster).success(function(nbSong)
          {
            serviceDb.nextsong(cluster,nbSong).success(function (data1)
            {
              $scope.song = data1[0];
              console.log(data1);
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
              $scope.mesTags = liste;
            });
          }
          );
      });
    };

    $scope.loadSimil = function () {
      $scope.loading = true;
      $scope.mesTags = [];
      serviceDb.similSong(laSimilaire).success(function (data) {
        if(data){
          $scope.song = data;
          $scope.proposition = "similaire";
          $scope.loadPreview();
          $scope.isLoading = false;
          var tags = data.tags;
          var liste = tags.slice(0, 5);

          $scope.mesTags = liste;
        }
        else{
          increment =0;
          $scope.loadSong();
        }
      });
    };

    $scope.like = function(){
      var song = $scope.song;
      var mail = $scope.userMail;


      var data = "{ \"track_id\": " + "\"" + song.track_id + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      //On initialise la liste de tags en enlevant le poids de chaque tag
      var tabTags = [];
      if(song.tags.length < 10) {
        for (var j = 0; j < song.tags.length; j++) {
          console.log(song.tags[j][0]);
          tabTags.push(song.tags[j][0]);
        }
      }else{
        for (var j = 0; j < 10; j++) {
          console.log(song.tags[j][0]);
          tabTags.push(song.tags[j][0]);
        }
      }

      //On parcours les tags pour retrouver les chaines de caractère rap, rock, electro, hiphop...
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

      serviceDb.getTabLikes(mail).success(function (tablikes) {
        var exist = false;
        var dataStyles = "{ \"styles\": " + "\"" + styles + "\" "
          + ", \"userMail\": " + "\"" + mail + "\" } ";
        if (tablikes) {
          for (var i = 0; i < tablikes.length; i++) {
            if (tablikes[i] == song) {
              exist = true;
              break;
            }
          }
          if (!exist) {
            serviceDb.addLike(data).success(function (data) {});
            if (styles.length != 0 )
            {serviceDb.addTag(dataStyles).success(function (data) {});
            }
            styles=[];
          }
        }
      });

      serviceDb.getTabDislikes(mail).success(function (tabdislikes) {
        var exist = false;
        if (tabdislikes) {
          for (var i = 0; i < tabdislikes.length; i++) {
            if (tabdislikes[i] == song) {
              exist = true;
              break;
            }
          }
          if (exist) {
            serviceDb.removeSongDislike().success(function () {
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
        $scope.loadSong();
      }
    };

    $scope.diversSong = function () {
      var mail = $scope.userMail;
      serviceDb.getcluster(mail).success(function (data)
      {
        var cluster = data;
        console.log(cluster);
        serviceDb.countsong(cluster).success(function(nbSong)
          {
            serviceDb.diversSong(cluster,nbSong).success(function (data1)
            {
              $scope.song = data1[0];
              console.log(data1);
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
              $scope.mesTags = liste;
            });
          }
        );
      });
    };
    
    $scope.dislike = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;


      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";


      serviceDb.getTabDislikes(mail).success(function (tabdislikes) {
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
            serviceDb.addDislike(data).success(function (data) {});

          }
        }
      });

      serviceDb.getTabLikes(mail).success(function (tablikes) {
        var exist = false;
        if (tablikes) {
          for (var i = 0; i < tablikes.length; i++) {
            if (tablikes[i] == song) {
              exist = true;
              break;
            }
          }
          if (exist) {
            serviceDb.removeSongLike().success(function () {
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
