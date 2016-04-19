'use strict';

describe('Service: redirectionservice', function () {

  // load the service's module
  beforeEach(module('pwilApp'));

  // instantiate service
  var redirectionservice;
  beforeEach(inject(function (_redirectionservice_) {
    redirectionservice = _redirectionservice_;
  }));

  it('should do something', function () {
    expect(!!redirectionservice).toBe(true);
  });

});
