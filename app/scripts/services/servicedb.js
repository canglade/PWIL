'use strict';

/**
 * @ngdoc service
 * @name pwilApp.serviceDb
 * @description
 * # serviceDb
 * Factory in the pwilApp.
 */
angular.module('pwilApp')
  .factory('serviceDb', function ($http) {
    return {
      songs: function(){
        return $http.get("http://localhost:3000/songs");
      },
    }
  });
