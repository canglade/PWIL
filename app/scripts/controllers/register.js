'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('RegisterCtrl', function ($scope, AuthService, $state) {
    $scope.user = {
      firstname: '',
      lastname: '',
      mail: '',
      password: '',
      username: '',
      birthdate:''
    };

    $scope.signup = function() {
      AuthService.register($scope.user).then(function(msg) {
        $state.go('outside.login');
       /* var alertPopup = $ionicPopup.alert({
          title: 'Register success!',
          template: msg
        });*/
        $scope.registerResult ="Register success";
      }, function(errMsg) {
       /* var alertPopup = $ionicPopup.alert({
          title: 'Register failed!',
          template: errMsg
        });*/
        $scope.registerResult = "Register failed !";
      });
    };

    $scope.arrive = function() {
      if (AuthService.isAuthenticated()) {
        $state.go('inside');
      }
    };



    $scope.arrive();

  });
