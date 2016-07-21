'use strict';

describe('Controller: ProjectviewCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ProjectviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectviewCtrl = $controller('ProjectviewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
