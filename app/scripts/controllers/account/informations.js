'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:AccountCtrl
 * @description
 * # AccountInformationsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('AccountInformationsCtrl', function ($rootScope, $scope, AuthService, API_ENDPOINT, $http, $state, $mdDialog, serviceDb) {
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

    $scope.reinitAcount= function (event){
      var confirm = $mdDialog.confirm()
        .title('Voulez vous réinitialiser les données de votre compte ?')
        //.textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');
      $mdDialog.show(confirm).then(function() {
        console.log($scope.userMail);
        serviceDb.reinitAccount($scope.userMail);
        $state.go('account.initialisation');
      }, function() {
        //Annuler donc rien ne se passe
      });
    }

    $scope.logout = function() {
      AuthService.logout();
      $state.go('outside.login');
    };

    $scope.AuthentificatedRedirection();
  })
