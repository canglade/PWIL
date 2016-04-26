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
      getAllObjects: function(collection){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/' + collection
        });
      },
      createObject: function(collection, data){
        return  $http({
          method: 'POST',
          url: 'http://localhost:3000/' + collection + '/',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },
      randSong: function(){
        return $http.get("http://localhost:3000/songs/rand");
      },
      similSong: function(track){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/songs/simil',
          headers: {"track_id" : track}
        });
      },
      addLike: function(data){
        return $http({
          method: 'PUT',
          url: 'http://localhost:3000/users/like',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },
      addDislike: function(data){
        return $http({
          method: 'PUT',
          url: 'http://localhost:3000/users/dislike',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },

      getTabDislikes: function(mail){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/users/tabdislikes',
          headers : { 'mail': mail }
        });
      },

      removeSongDislike: function(){
        return  $http({
          method: 'Put',
          url: 'http://localhost:3000/users/removesongDislike',
          headers : { 'Content-Type': 'application/json' }
        });
      },

      removeSongLike: function(){
        return  $http({
          method: 'Put',
          url: 'http://localhost:3000/users/removesongLike',
          headers : { 'Content-Type': 'application/json' }
        });
      },

      getTabLikes: function(mail){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/users/tablikes',
          headers : { 'mail': mail }
        });
      }
    }
  });
