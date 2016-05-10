'use strict';

describe('Controller: RadioCtrl', function () {

  // load the controller's module
  beforeEach(module('pwilApp'));

  var RadioCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RadioCtrl = $controller('RadioCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RadioCtrl.awesomeThings.length).toBe(3);
  });
});
