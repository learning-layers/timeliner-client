'use strict';

describe('Controller: PasswordResetCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var PasswordResetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PasswordResetCtrl = $controller('PasswordResetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach functionalities to scope', function () {
    expect(scope.updating).toBeDefined();
    expect(scope.updating).toBe(false);

    expect(scope.model).toBeDefined();
    expect(typeof scope.model).toBe('object');

    expect(scope.isReset).toBeDefined();
    expect(typeof scope.isReset).toBe('function');
    expect(scope.isReset()).toBe(false);

    expect(scope.submitResetRequest).toBeDefined();
    expect(typeof scope.submitResetRequest).toBe('function');

    expect(scope.submitReset).toBeDefined();
    expect(typeof scope.submitReset).toBe('function');
  });
});
