'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('AboutCtrl', function ($rootScope) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "";
    $rootScope.activeContacts = "";
    $rootScope.activeAbout = "active";
    $rootScope.activeConnection = "";
  });
