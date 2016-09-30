'use strict';

describe('Service: dialogHelper', function () {

  // load the service's module
  beforeEach(module('timelinerApp'));

  // instantiate service
  var dialogHelper;
  beforeEach(inject(function (_dialogHelper_) {
    dialogHelper = _dialogHelper_;
  }));

  it('should have getUseFullScreen defined and always true', function () {
    expect(dialogHelper.getUseFullScreen).toBeDefined();
    expect(typeof dialogHelper.getUseFullScreen).toBe('function');
    expect(dialogHelper.getUseFullScreen()).toBe(true);
  });

  it('should have openProjectEditDialog defined', function() {
    expect(dialogHelper.openProjectEditDialog).toBeDefined();
    expect(typeof dialogHelper.openProjectEditDialog).toBe('function');
  });
});
