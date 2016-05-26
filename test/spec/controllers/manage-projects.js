'use strict';

describe('Controller: ManageProjectsCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ManageProjectsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageProjectsCtrl = $controller('ManageProjectsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
