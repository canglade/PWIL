'use strict';

describe('Controller: SongsCtrl', function () {

  // load the controller's module
  beforeEach(module('pwilApp'));

  var SongsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SongsCtrl = $controller('SongsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SongsCtrl.awesomeThings.length).toBe(3);
  });
});
