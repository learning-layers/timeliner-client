'use strict';

describe('Controller: EditProjectModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var EditProjectModalInstanceCtrl,
    scope,
    $mdDialog;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $mdDialog = jasmine.createSpyObj('$mdDialog', ['hide', 'cancel']);
    EditProjectModalInstanceCtrl = $controller('EditProjectModalInstanceCtrl', {
      $scope: scope,
      $mdDialog: $mdDialog,
      project: {
        _id: 'id'
      }
      // place here mocked dependencies
    });
  }));

  it('should attach a states to the scope', function () {
    expect(scope.projectStates).toBeDefined();
    expect(typeof scope.projectStates).toBe('object');
    expect(scope.projectStates.length).toBe(2);
  });

  it('should attach model to the scope', function() {
    expect(scope.model).toBeDefined();
    expect(typeof scope.model).toBe('object');
    expect(Object.keys(scope.model).length).toBe(6);
  });

  it('should attach isOwner to the scope', function() {
    expect(scope.isOwner).toBeDefined();
    expect(typeof scope.isOwner).toBe('function');
  });

  it('sgould attach submit and cancel to the scope', function() {
    expect(scope.submit).toBeDefined();
    expect(typeof scope.submit).toBe('function');

    expect(scope.cancel).toBeDefined();
    expect(typeof scope.cancel).toBe('function');
  });
});
