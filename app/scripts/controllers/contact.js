'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('ContactCtrl', function ($rootScope) {
    $rootScope.activeHome = "";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "";
    $rootScope.activeContacts = "active";
    $rootScope.activeAbout = "";
    $rootScope.activeConnection = "";
  });
