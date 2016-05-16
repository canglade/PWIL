angular
  .module("pwilApp").directive('useravatar', ["avatarService", function (avatarService) {
  var controller = function ($scope, $rootScope) {
    $rootScope.$watch("username", function (newval, oldval) {
      $scope.ImageAvailable = false;
      if (!$scope.User.Avatar) {
        $scope.GenericAvatar = avatarService.getAvatar($scope.User);
      } else {
        $scope.ImageAvailable = true;
      }

    });
  }
  return {
    restrict: 'C',
    scope: {
      User: '=user'
    },
    template: '<div class="generic-avatar">'+
    '<a class="thumb spacer animated fadeIn color" style="background-color:{{GenericAvatar.Background}}"></a>'+
    '<a class="name">{{GenericAvatar.Initials}}</a>' +
    '<a class="img" data-ng-if="ImageAvailable" style="background-image:url({{User.Avatar}})"></a>' +
    '</div>',
    controller: controller
  };
}])
