'use strict';

describe('Controller: ManageCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ManageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageCtrl = $controller('ManageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
