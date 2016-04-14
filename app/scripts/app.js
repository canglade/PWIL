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
    'ngRoute',
    'ngMaterial',
    'ngMessages'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
      })
      .when('/songs', {
        templateUrl: 'views/songs.html',
        controller: 'SongsCtrl',
        controllerAs: 'songs',
      })
      .when('/connection', {
        templateUrl: 'views/connection.html',
        controller: 'ConnectionCtrl',
        controllerAs: 'connection',
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'users'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
