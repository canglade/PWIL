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
    'ngMessages',
    'ui.router'
  ])
  .config(function ($stateProvider,$routeProvider) {
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
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'account'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .otherwise({
        redirectTo: '/'
      });

    $stateProvider
      .state('outside', {
        url: '',
        abstract: true,
        templateUrl: 'views/main.html'
      })
      .state('outside.login', {
        url: 'connection',
        templateUrl: 'views/connection.html',
        controller: 'ConnectionCtrl'
      })
      .state('outside.register', {
        url: 'register',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .state('inside', {
        url: 'account',
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      });

  })

  .controller('AppCtrl', function($scope, $state, AuthService, AUTH_EVENTS) {
    $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
      AuthService.logout();
      $state.go('outside.login');
      /*var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });*/
    });
  })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

      /*$rootScope.$broadcast('onLogin');
      $rootScope.$on('onLogin', function() {
        if (AuthService.isAuthenticated())
          $rootScope.isAuthenticated = true;
        else
          $rootScope.isAuthenticated = false;
      });*/

      if (AuthService.isAuthenticated())
        $rootScope.isAuthenticated = true;
      else
        $rootScope.isAuthenticated = false;


      $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        if (!AuthService.isAuthenticated()) {
          console.log(next.name);
          if (next.name !== 'outside.login' && next.name !== 'outside.register') {
            event.preventDefault();
            $state.go('outside.login');
          }
        }

        if (AuthService.isAuthenticated())
          $rootScope.isAuthenticated = true;
        else
          $rootScope.isAuthenticated = false;

      });
    });
