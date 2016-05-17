'use strict';

describe('Service: SystemMessagesService', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var SystemMessagesService;
  beforeEach(inject(function (_SystemMessagesService_) {
    SystemMessagesService = _SystemMessagesService_;
  }));

  it('should expose public API', function () {
    expect(SystemMessagesService.show).toBeDefined();
    expect(typeof SystemMessagesService.show).toBe('function');

    expect(SystemMessagesService.showInfo).toBeDefined();
    expect(typeof SystemMessagesService.showInfo).toBe('function');

    expect(SystemMessagesService.showSuccess).toBeDefined();
    expect(typeof SystemMessagesService.showSuccess).toBe('function');

    expect(SystemMessagesService.showWarning).toBeDefined();
    expect(typeof SystemMessagesService.showWarning).toBe('function');

    expect(SystemMessagesService.showError).toBeDefined();
    expect(typeof SystemMessagesService.showError).toBe('function');
  });

});
