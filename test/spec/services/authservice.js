'use strict';

describe('Service: authservice', function () {

  // load the service's module
  beforeEach(module('pwilApp'));

  // instantiate service
  var authservice;
  beforeEach(inject(function (_authservice_) {
    authservice = _authservice_;
  }));

  it('should do something', function () {
    expect(!!authservice).toBe(true);
  });

});
