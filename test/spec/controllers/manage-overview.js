'use strict';

describe('Controller: ManageOverviewCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ManageOverviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageOverviewCtrl = $controller('ManageOverviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
