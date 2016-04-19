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

    $scope.like = function(){
      var song = $scope.song.track_id;
      var mail = $scope.userMail;

      /*var data = "{\"track_id\": \"" + song + "\" } ";*/

      var data = "{ \"track_id\": " + "\"" + song + "\" "
        + ", \"userMail\": " + "\"" + mail + "\" } ";

      serviceDb.addLike(data).success(function(data){
       /*$route.reload();
        $scope.loadSong();*/
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
