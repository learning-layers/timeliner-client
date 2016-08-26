'use strict';

describe('Directive: tlColorSelect', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should attach helper methods and change color', inject(function ($compile) {
    element = angular.element('<tl-color-select></tl-color-select>');
    element = $compile(element)(scope);
  }));
});
