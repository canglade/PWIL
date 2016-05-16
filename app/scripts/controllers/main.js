'use strict';

/**
 * @ngdoc function
 * @name pwilApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the pwilApp
 */
angular.module('pwilApp')
  .controller('MainCtrl', function ($rootScope) {
    $rootScope.activeHome = "active";
    $rootScope.activeSongs = "";
    $rootScope.activeAccount = "";    
    
    $rootScope.activeConnection = "";
  });
