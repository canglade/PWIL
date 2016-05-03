'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('RegisterCtrl', function ($scope, AuthService, $state, Flash) {
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

    $scope.success = function() {
      var message = '<strong>Well done!</strong> You successfully read this important alert message.';
      Flash.create('success', message);
    };
    $scope.info = function() {
      var message = '<strong>Heads up!</strong> This alert needs your attention, but it\'s not super important.';
      Flash.create('info', message);
    };
    $scope.warning = function() {
      var message = '<strong>Warning!</strong> Better check yourself, you\'re not looking too good.';
      Flash.create('warning', message);
    };
    $scope.danger = function() {
      var message = '<strong>Oh snap!</strong> Change a few things up and try submitting again.';
      Flash.create('danger', message);
    };

    $scope.signup = function(isValid) {

      if (isValid) {

        var concatBirthdate = new Date($scope.birthdate.year, $scope.birthdate.month, $scope.birthdate.day);
        concatBirthdate.setDate(concatBirthdate.getDate() - 30);
        $scope.user.birthdate = concatBirthdate;

        AuthService.register($scope.user).then(function (msg) {
          $state.go('outside.login');
          /* var alertPopup = $ionicPopup.alert({
           title: 'Register success!',
           template: msg
           });*/
          $scope.registerResult = "Register success";
        }, function (errMsg) {
          /* var alertPopup = $ionicPopup.alert({
           title: 'Register failed!',
           template: errMsg
           });*/
          $scope.registerResult = errMsg;
          var message = '<strong>Attention!</strong> '+errMsg+'.';
          Flash.create('danger', message);
        });
      }
      else {
        $scope.registerResult = "Certains champs sont invalides"
        var message = '<strong>Attention!</strong> Certains champs sont invalides.';
        Flash.create('danger', message);
      }



    };

    $scope.onArrival = function() {
      if (AuthService.isAuthenticated()) {
        $state.go('inside');
      }
    };

    $scope.onArrival();

  });
