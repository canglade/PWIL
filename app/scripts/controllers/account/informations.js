'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:AccountCtrl
 * @description
 * # AccountInformationsCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('AccountInformationsCtrl', function ($rootScope, $scope, AuthService, API_ENDPOINT, $http, $state, $mdDialog, Flash,dbService) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "active";
    $rootScope.activeConnection = "";

    $scope.user = {
      firstname: '',
      lastname: '',
      mail: '',
      password: '',
      confirmpassword: '',
      username: '',
      birthdate:''
    };

    $scope.birthdate = {
      day: '',
      month: '',
      year: ''
    };

    $scope.$on('$viewContentLoaded', function () {
      $scope.getInfo();
      $scope.graph();
    });

    $scope.destroySession = function() {
      AuthService.logout();
    };

    $scope.getInfo = function() {     

      $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {

        $scope.user.lastname = result.data.user.lastname;
        $scope.user.firstname = result.data.user.firstname;
        $scope.user.username = result.data.user.username;
        $scope.user.birthdate = result.data.user.birthdate;
        var birthdateDate =  new Date(result.data.user.birthdate);
        $scope.birthdate.year = birthdateDate.getFullYear();
        $scope.birthdate.month = birthdateDate.getMonth()+1;
        $scope.birthdate.day = birthdateDate.getDate()-1;
        $scope.user.mail = result.data.user.mail;
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
        dbService.reinitAccount($scope.userMail);
        $state.go('account.initialisation');
      }, function() {
        //Annuler donc rien ne se passe
      });
    }

    $scope.logout = function() {
      AuthService.logout();
      $state.go('outside.login');
    };

    $scope.update = function(isValid, event) {

      var confirm = $mdDialog.confirm()
        .title('Voulez vous modifier les données de votre compte ?')
        //.textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');
      $mdDialog.show(confirm).then(function() {

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

          dbService.updateUser($scope.user,$scope.userMail).then(function (msg) {
            Flash.create('success', "Utilisateur modifié avec succès !");
            $rootScope.userMail = $scope.user.mail;
            $rootScope.username =  $scope.user.username;
            window.localStorage.setItem('USER_PSEUDO', $rootScope.username);
            window.localStorage.setItem('USER_MAIL', $rootScope.userMai);
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

      }, function() {
        //Annuler donc rien ne se passe
      });


    };

    $scope.updatePassword = function(isValid, event) {
      var confirm = $mdDialog.confirm()
        .title('Voulez vous modifier votre mot de passe ?')
        //.textContent('All of the banks have agreed to forgive you your debts.')
        .ariaLabel('Lucky day')
        .targetEvent(event)
        .ok('Oui')
        .cancel('Non');
      $mdDialog.show(confirm).then(function() {
        if (isValid) {
          dbService.updateUserPassword($scope.user, $scope.userMail).then(function (msg) {
            Flash.create('success', "Mot de passe modifié avec succès !");
          });
        }
        else {
          var message = '<strong>Attention!</strong> Certains champs sont invalides.';
          Flash.create('danger', message);
        }
      }, function() {
        //Annuler donc rien ne se passe
      });
    }

    $scope.graph = function (){
      dbService.getTabTags($scope.userMail).success(function (tabTags) {
        var chart = c3.generate({
          bindto: '#pieStat',
          title: {
            text: "Proportion de like distribués"
          },
          data: {
            columns: [
              ['Rock', tabTags[0]],
              ['Rap', tabTags[1]],
              ['Electro', tabTags[2]]
            ],
            type: 'pie'
          }
        });
      });
    };

    $scope.AuthentificatedRedirection();
  });
