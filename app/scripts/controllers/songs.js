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
      serviceDb.randSong().success(function (data) {
        $scope.loading = false;
        $scope.song = data;
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
      
      $scope.loadSong();
    };

    $scope.dislike = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      serviceDb.addDislike(data).success(function(data){
        /*$route.reload();
         $scope.loadSong();*/
      });

      $scope.loadSong();
    };

    $scope.AuthentificatedRedirection();
});
