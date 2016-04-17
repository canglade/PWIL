'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:SongsCtrl
 * @description
 * # SongsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('ConnectionCtrl', function ($scope, AuthService, $state) {
    $scope.user = {
      mail: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.user).then(function(msg) {
        $state.go('inside');       
        $rootscope.mail = $scope.user.mail;
      }, function(errMsg) {
        /*var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: errMsg
        });*/
        $scope.loginResult = "Login failed !";
      });
    };

    if(AuthService.isAuthenticated()) {
      AuthService.logout();
      $state.go('inside');
    }

    //$scope.emit('onLogin');

  });
