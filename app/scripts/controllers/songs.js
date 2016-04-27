'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */

angular.module('pwilApp')
  .controller('SongsCtrl', function ($rootScope, $scope, $route, serviceDb, $sce) {
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
    $scope.loading = true;

    //$scope.orderByArtist = "artist";

    $scope.lecteur= function () {
      /*var artista ="";
       var artista = "";
       var song  = "";
       var song = "";*/
      var artiste = $scope.song.artist.replace(/ /g, "+");
      var chanson = $scope.song.title.replace(/ /g, "+");

      console.log("ARTISTE: " + artiste + " SONG: " + chanson);
      //var url = "https://api.spotify.com/v1/search?q=artist:Lady+Gaga+title:Bad+Romance&type=track&limit=1";
      var url = "https://api.spotify.com/v1/search?q=artist:" + artiste +  "+title:" + chanson + "&type=track&limit=1";
      console.log("URL: " + url);
      $.getJSON(url).then(function(data) {
        $scope.previewUrl = $sce.trustAsResourceUrl(data.tracks.items[0].preview_url)
        console.log("PREVIEW URL: " + data.tracks.items[0].preview_url);
      })
    };

    $scope.loadSong = function () {
      $scope.loading = true;
      $scope.mesTags = [];
      serviceDb.randSong().success(function (data) {
        $scope.loading = false;
        $scope.song = data;
        $scope.proposition = "aleatoire";
        increment = 0;
        var tags = data.tags;
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
    };

    $scope.loadSimil = function () {
      $scope.loading = true;
      $scope.mesTags = [];
      serviceDb.similSong(laSimilaire).success(function (data) {
        if(data){
          $scope.proposition = "similaire";
          $scope.loading = false;
          $scope.song = data;
          var tags = data.tags;
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
        }
        else{
          increment =0;
          $scope.loadSong();
        }
      });
    };

    /*$scope.pageChanged = function(){
     $scope.loadSong();
     };*/
    $scope.loadSong();
    $scope.like = function(){
      var song = $scope.song;
      var mail = $scope.userMail;

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

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
            serviceDb.addLike(data).success(function (data) {
              /*$route.reload();
               $scope.loadSong();*/
            });
            if (styles.length != 0 )
            {serviceDb.addTag(dataStyles).success(function (data) {
              /*$route.reload();
               $scope.loadSong();*/
            });
            }
            $scope.styles = styles;
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
              /*$scope.remove=exist;
               $scope.idtrack=$scope.song.track_id;*/
              /*$route.reload();
               $scope.loadSong();*/
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

    $scope.dislike = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

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
            serviceDb.addDislike(data).success(function (data) {
              /*$route.reload();
               $scope.loadSong();*/
            });

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
              /*$route.reload();
               $scope.loadSong();*/
            });
          }
        }
      });
      $scope.loadSong();
    };

    $scope.AuthentificatedRedirection();
  });
