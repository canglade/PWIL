'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */

angular.module('pwilApp')
  .controller('SongsCtrl', function ($rootScope, $scope,$route, serviceDb) {
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

    $scope.loadSong = function () {
      $scope.loading = true;
      $scope.mesTags = [];
      serviceDb.randSong().success(function (data) {
        $scope.loading = false;
        $scope.song = data;
        var i;
        var tags = data.tags;
        var liste = [];
        for(i=0;i<10;i++){
          liste.push(tags[i]);
        }
        $scope.mesTags = liste;
      });
    };

    /*$scope.pageChanged = function(){
      $scope.loadSong();
    };*/

    $scope.loadSong();

    $scope.like = function() {
      var song = $scope.song.track_id;
      var mail = $scope.userMail;

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      serviceDb.getTabLikes(mail).success(function (tablikes) {
        var exist = false;
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

      $scope.loadSong();
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
