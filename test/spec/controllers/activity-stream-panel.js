'use strict';

describe('Controller: ActivityStreamPanelCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ActivityStreamPanelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ActivityStreamPanelCtrl = $controller('ActivityStreamPanelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a model to the scope', function () {
    expect(scope.model).toBeDefined();
    expect(typeof scope.model).toBe('object');
  });
});
