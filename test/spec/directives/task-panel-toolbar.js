'use strict';

describe('Directive: itemPanelToolbar', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should display toolbar for panels', inject(function ($compile) {
    element = angular.element('<item-panel-toolbar></item-panel-toolbar>');
    element = $compile(element)(scope);
  }));
});
