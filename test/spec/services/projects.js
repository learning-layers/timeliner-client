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

  it('should have mine method defined', function () {
    expect(ProjectsService.mine).toBeDefined();
    expect(typeof ProjectsService.mine).toBe('function');
  });

  it('should have all method defined', function () {
    expect(ProjectsService.all).toBeDefined();
    expect(typeof ProjectsService.all).toBe('function');
  });
  
});
