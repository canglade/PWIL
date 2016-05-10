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
    'ngFlash',
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
      .when('/account/initialisation', {
        templateUrl: 'views/account/initialisation.html',
        controller: 'AccountInitialisationCtrl',
        controllerAs: 'accountInitialisation',
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
      .when('/account/informations', {
        templateUrl: 'views/account/informations.html',
        controller: 'AccountInformationsCtrl',
        controllerAs: 'accountInformations'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/radio', {
        templateUrl: 'views/radio.html',
        controller: 'RadioCtrl',
        controllerAs: 'radio'
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
      .state('account', {
        url: '',
        abstract: true
      })
      .state('account.initialisation', {
        url: 'account/initialisation',
        templateUrl: 'views/account/initialisation.html',
        controller: 'AccountInitialisationCtrl'
      })
      .state('account.informations', {
        url: 'account/informations',
        templateUrl: 'views/account/informations.html',
        controller: 'AccountInformationsCtrl'
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
    $rootScope.userMail = window.localStorage.getItem('USER_MAIL');

    $rootScope.AuthentificatedRedirection = function() {
      //$scope.memberinfo = AuthService.isAuthenticated();
      if (!AuthService.isAuthenticated()) {
        $state.go('outside.login');
      }

    };

    if (AuthService.isAuthenticated())
      $rootScope.isAuthenticated = true;
    else
      $rootScope.isAuthenticated = false;


    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
      $rootScope.userMail = window.localStorage.getItem('USER_MAIL');

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
