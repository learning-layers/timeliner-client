'use strict';

describe('Controller: SocialLoginCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var SocialLoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SocialLoginCtrl = $controller('SocialLoginCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should exist', function () {
    expect(SocialLoginCtrl).toBeDefined();
  });
});
