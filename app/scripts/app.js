'use strict';

/**
 * @ngdoc overview
 * @name pwilApp
 * @description
 * # pwilApp
 *
 * Main module of the application.
 */
angular
  .module('pwilApp', [
    'ngAnimate',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/songs', {
        templateUrl: 'views/songs.html',
        controller: 'SongsCtrl',
        controllerAs: 'songs'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
