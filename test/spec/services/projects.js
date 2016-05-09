'use strict';

describe('Service: projects', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var ProjectsService;
  beforeEach(inject(function (_ProjectsService_) {
    ProjectsService = _ProjectsService_;
  }));

  it('should have create method defined', function () {
    expect(ProjectsService.create).toBeDefined();
    expect(typeof ProjectsService.create).toBe('function');
  });

});
