'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('AccountCtrl', function ($scope, AuthService, API_ENDPOINT, $http, $state) {
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

    $scope.arrive = function() {
      //$scope.memberinfo = AuthService.isAuthenticated();
      if (AuthService.isAuthenticated()) {
        $scope.memberinfo = "Connecté";
      }
      else {
        $scope.memberinfo = "Non connecté";
        $state.go('outside.login');
      }
    };



    $scope.arrive();
  })

  .controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('outside.login');
      /*var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });*/
    });
  });
