'use strict';

describe('Controller: AppCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach isLoggedIn function to the scope', function () {
    expect(typeof scope.isLoggedIn).toBe('function');
  });
});
