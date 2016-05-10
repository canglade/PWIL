'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:AccountCtrl
 * @description
 * # AccountInformationsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('AccountInformationsCtrl', function ($rootScope, $scope, AuthService, API_ENDPOINT, $http, $state) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "active";
    $rootScope.activeContacts = "";
    $rootScope.activeAbout = "";
    $rootScope.activeConnection = "";
    
    $scope.destroySession = function() {
      AuthService.logout();
    };

    $scope.getInfo = function() {
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
        $scope.memberinfo = result.data.msg;
      });
    };

    $scope.logout = function() {
      AuthService.logout();
      $state.go('outside.login');
    };
    
    $scope.AuthentificatedRedirection();
  })
