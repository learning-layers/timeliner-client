'use strict';

describe('Directive: tlFileUpload', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tl-file-upload></tl-file-upload>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the tlFileUpload directive');
  }));
});
