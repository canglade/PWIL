'use strict';

describe('Service: serviceDb', function () {

  // load the service's module
  beforeEach(module('pwilApp'));

  // instantiate service
  var serviceDb;
  beforeEach(inject(function (_serviceDb_) {
    serviceDb = _serviceDb_;
  }));

  it('should do something', function () {
    expect(!!serviceDb).toBe(true);
  });

});
