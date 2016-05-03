'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:ConnectionCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('ConnectionCtrl', function ($rootScope, $scope, AuthService, $state, Flash) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "";
    $rootScope.activeContacts = "";
    $rootScope.activeAbout = "";
    $rootScope.activeConnection = "active";

    $scope.user = {
      mail: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.user).then(function(msg) {

        if (AuthService.isAuthenticated())
          $rootScope.isAuthenticated = true;
        else
          $rootScope.isAuthenticated = false;

        $state.go('inside');
      }, function(errMsg) {
        /*var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: errMsg
        });*/
        var message = '<strong>Erreur !</strong> '+errMsg;
        Flash.create('danger', message);
      });
    };

    if(AuthService.isAuthenticated()) {
      //$state.go('outside');
      AuthService.logout();

      if (AuthService.isAuthenticated())
        $rootScope.isAuthenticated = true;
      else
        $rootScope.isAuthenticated = false;
    }

    //$scope.emit('onLogin');

  });
