'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('SongsCtrl', function ($scope,serviceDb) {
    $scope.currentPage = 1;
    $scope.totalPages = 0;
    $scope.loading = true;
    //$scope.orderByArtist = "artist";

    $scope.loadSongs = function () {
      $scope.loading = true;
      serviceDb.songs().success(function (data) {
        $scope.loading = false;
        $scope.songs = data;
      });
    };

    $scope.pageChanged = function(){
      $scope.loadSongs();
    };

    $scope.loadSongs();

});
