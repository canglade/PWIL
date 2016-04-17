'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */

angular.module('pwilApp')
  .controller('SongsCtrl', function ($scope,serviceDb, AuthService) {
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

    $scope.pageChanged = function(){
      $scope.loadSong();
    };

    $scope.loadSong();

    $scope.like = function(){
      var song = $scope.song.track_id;
      var mail = AuthService.mail();

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      serviceDb.addLike('users', data).success(function(data){
        $route.reload();
      });
    };

    $scope.dislike = function(){

    }
});
