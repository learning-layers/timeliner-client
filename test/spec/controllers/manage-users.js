'use strict';

describe('Controller: ManageUsersCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ManageUsersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageUsersCtrl = $controller('ManageUsersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
