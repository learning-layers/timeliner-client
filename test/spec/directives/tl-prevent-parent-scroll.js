'use strict';

describe('Directive: tlPreventParentScroll', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should attach mousewheel', inject(function ($compile) {
    element = angular.element('<tl-prevent-parent-scroll></tl-prevent-parent-scroll>');
    element = $compile(element)(scope);
    // TODO Check mousewheel listener  
  }));
});
