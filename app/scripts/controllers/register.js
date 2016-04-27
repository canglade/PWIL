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

    $scope.birthdate = {
      day: '',
      month: '',
      year: ''
    };

    $scope.signup = function() {

      var concatBirthdate = new Date($scope.birthdate.year, $scope.birthdate.month, $scope.birthdate.day);
      concatBirthdate.setDate(concatBirthdate.getDate() - 30);
      $scope.user.birthdate = concatBirthdate;

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

    $scope.onArrival = function() {
      if (AuthService.isAuthenticated()) {
        $state.go('inside');
      }
    };

    $scope.onArrival();

  });
