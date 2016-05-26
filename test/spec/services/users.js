'use strict';

describe('Service: users', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var UsersService;
  beforeEach(inject(function (_UsersService_) {
    UsersService = _UsersService_;
  }));

  it('should have all method defined', function () {
    expect(UsersService.all).toBeDefined();
    expect(typeof UsersService.all).toBe('function');
  });

});
