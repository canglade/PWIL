'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('UsersCtrl', function ($scope, serviceDb) {

    $scope.createUser = function() {

      var email = $scope.user.email;
      var name = $scope.user.name;
      var username = $scope.user.username;


      // TODO Faire la validation du formulaire de création du collaborateur
      var data = "{ \"username\": " + "\"" + username + "\" "
        + ", \"name\": " + "\"" + name + "\" "
        + ", \"email\": \"" + email + "\" } ";

      console.log(data);

      serviceDb.createObject('users', data)
        .success(function (data) {
          console.log(data);
          $scope.user.email = "";
          $scope.user.name ="";
          $scope.user.username ="";

          serviceDb.getAllObjects('users')
            .success(function (data) {
              $scope.users = data;
            })
            .error(function (err) {
              console.error(err);
            });

        })
        .error(function (err) {
          console.log(err);
        });
    };

    // Lancement au chargement de la page
    $scope.$on('$viewContentLoaded', function() {

      // Rôle proposé dans le combo du formulaire de création
     // $scope.roles = ["Admin", "Manager", "Collaborateur"];


      serviceDb.getAllObjects('users')
        .success(function (data) {
          $scope.users = data;
        })
        .error(function (err) {
          console.error(err);
        });
    });

  });

