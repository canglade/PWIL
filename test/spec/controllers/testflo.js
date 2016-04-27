'use strict';

describe('Controller: TestfloCtrl', function () {

  // load the controller's module
  beforeEach(module('pwilApp'));

  var TestfloCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestfloCtrl = $controller('TestfloCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TestfloCtrl.awesomeThings.length).toBe(3);
  });
});
