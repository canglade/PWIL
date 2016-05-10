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

    $scope.signup = function(isValid) {

      var m = parseInt($scope.birthdate.month, 10);
      var d = parseInt($scope.birthdate.day, 10);
      var y = parseInt($scope.birthdate.year, 10);
      var concatBirthdate = new Date(y,m-1,d);
      if (concatBirthdate.getFullYear() == y && concatBirthdate.getMonth() + 1 == m && concatBirthdate.getDate() == d) {
        concatBirthdate.setDate(concatBirthdate.getDate()+1);
        $scope.user.birthdate = concatBirthdate;
      } else {
        console.log('Invalid date');
        isValid = false;
      }

      if (isValid) {

        AuthService.register($scope.user).then(function (msg) {
          $state.go('outside.login');
          Flash.create('success', "Utilisateur crée avec succès !");
        }, function (errMsg) {

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
        $state.go('account.initialisation');
      }
    };

    $scope.onArrival();
  });
