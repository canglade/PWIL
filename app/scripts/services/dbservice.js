'use strict';

/**
 * @ngdoc service
 * @name pwilApp.dbService
 * @description
 * # dbService
 * Factory in the pwilApp.
 */
angular.module('pwilApp')
  .factory('dbService', function ($http, SERVER) {
    return {
      getAllObjects: function(collection){
        return  $http({
          method: 'GET',
          url: SERVER.url + collection
        });
      },
      createObject: function(collection, data){
        return  $http({
          method: 'POST',
          url: SERVER.url + collection + '/',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },
      randSong: function(){
        return $http.get(SERVER.url +"songs/rand");
      },
      similSong: function(track){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'songs/simil',
          headers: {"track_id" : track}
        });
      },
      addLike: function(data){
        return $http({
          method: 'PUT',
          url: SERVER.url + 'users/like',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },
      addDislike: function(data){
        return $http({
          method: 'PUT',
          url: SERVER.url + 'users/dislike',
          data: data,
          headers: { 'Content-Type': 'application/json' }
        });
      },

      getTabDislikes: function(mail){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'users/tabdislikes',
          headers : { 'mail': mail }
        });
      },

      removeSongDislike: function(){
        return  $http({
          method: 'Put',
          url: SERVER.url + 'users/removesongDislike',
          headers : { 'Content-Type': 'application/json' }
        });
      },

      removeSongLike: function(){
        return  $http({
          method: 'Put',
          url: SERVER.url + 'users/removesongLike',
          headers : { 'Content-Type': 'application/json' }
        });
      },

      addTag: function(styles){
        return  $http({
          method: 'Put',
          data: styles,
          url: SERVER.url + 'users/addTag',
          headers : { 'Content-Type': 'application/json' }
        });
      },

      isEmailFree: function(mail){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'users/email/free',
          headers : { 'mail': mail }
        });
      },

      getTabLikes: function(mail){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'users/tablikes',
          headers : { 'mail': mail }
        });
      },
      getSpotifyPreview: function(track, artist){
        return  $http({
          method: 'GET',
          url: 'http://localhost:3000/songs/preview/',
          headers : { 'track': track, 'artist': artist }
        });
      },
      nextsong: function(numcluster,nbsong){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'songs/nextsong',
          headers : { 'numcluster': numcluster , 'nbsong': nbsong}
        });
      },
      getcluster: function(mail){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'users/getcluster',
          headers : { 'mail': mail }
        });
      },
      countsong: function(numcluster){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'songs/countsong',
          headers : { 'numcluster': numcluster }
        });
      },
      diversSong: function(numcluster,nbsong) {
        return $http({
          method: 'GET',
          url: SERVER.url + 'songs/diversSong',
          headers: {'numcluster': numcluster, 'nbsong': nbsong}
        });
      },
      calculateClusters: function(){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'cluster/calculate/'
        });
      },
      reinitAccount: function(mail) {
        return $http({
          method: 'PUT',
          url: 'http://localhost:3000/users/reinit',
          data: {'mail': mail }
        });
      },
      updateUser: function(user,mail){
        return  $http({
          method: 'PUT',
          url: SERVER.url + 'api/update/user',
          data: {"mail" : mail,"newmail" : user.mail,"firstname" : user.firstname,"lastname" : user.lastname,"username" : user.username,"birthdate" : user.birthdate},
          headers: { 'Content-Type': 'application/json' }
        });
      },
      updateUserPassword: function(user,mail){
        return  $http({
          method: 'PUT',
          url: SERVER.url + 'api/update/user/password',
          data: {"mail" : mail,"password": user.password},
          headers: { 'Content-Type': 'application/json' }
        });
      },
      getTabTags: function(mail){
        return  $http({
          method: 'GET',
          url: SERVER.url + 'users/getTabTags',
          headers : { 'mail': mail }
        });
      }
    }
  });
