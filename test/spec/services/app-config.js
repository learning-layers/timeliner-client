'use strict';

describe('Service: appConfig', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var appConfig;
  beforeEach(inject(function (_appConfig_) {
    appConfig = _appConfig_;
  }));

  it('should exist', function () {
    expect(!!appConfig).toBe(true);
  });

  it('should be an object', function() {
    expect(typeof appConfig).toBe('object');
  });

  it('should have backendUrl', function() {
    expect(!!appConfig.backendUrl).toBe(true);
  });
});
