'use strict';

describe('Controller: NavbarCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var NavbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NavbarCtrl = $controller('NavbarCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach logout function to the scope', function () {
    expect(typeof scope.logout).toBe('function');
  });

  it('should attach getCurrentUserName function to the scope', function () {
    expect(typeof scope.getCurrentUserName).toBe('function');
  });
});
