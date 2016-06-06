'use strict';

describe('Directive: projectListTimeline', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<project-list-timeline></project-list-timeline>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the projectListTimeline directive');
  }));
});
