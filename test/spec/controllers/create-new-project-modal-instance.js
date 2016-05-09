'use strict';

describe('Controller: CreateNewProjectModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var CreateNewProjectModalInstanceCtrl,
    scope,
    $uibModalInstance;


  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $uibModalInstance = jasmine.createSpyObj('$uibModalInstance', ['close', 'dismiss']);
    CreateNewProjectModalInstanceCtrl = $controller('CreateNewProjectModalInstanceCtrl', {
      $scope: scope,
      $uibModalInstance: $uibModalInstance
      // place here mocked dependencies
    });
  }));

  it('should attach format to the scope', function() {
    expect(scope.format).toBeDefined();
    expect(typeof scope.format).toBe('string');
  });

  it('should attach a model to the scope', function () {
    expect(scope.model).toBeDefined();
    expect(typeof scope.model).toBe('object');
  });

  it('should attach popupStart to the scope', function() {
    expect(scope.popupStart).toBeDefined();
    expect(typeof scope.popupStart).toBe('object');
    expect(scope.popupStart.opened).toBe(false);
  });

  it('should attach popupEnd to the scope', function() {
    expect(scope.popupEnd).toBeDefined();
    expect(typeof scope.popupEnd).toBe('object');
    expect(scope.popupEnd.opened).toBe(false);
  });

  it('should attach dateOptions to the scope', function() {
    expect(scope.dateOptions).toBeDefined();
    expect(typeof scope.dateOptions).toBe('object');
  });

  it('should let the user confirm the modal', function() {
    expect(scope.submit).toBeDefined();
    expect(typeof scope.submit).toBe('function');
    scope.submit();
    expect($uibModalInstance.close).toHaveBeenCalled();
  });

  it('should let the user dismiss the modal', function() {
    expect(scope.cancel).toBeDefined();
    expect(typeof scope.cancel).toBe('function');
    scope.cancel();
    expect($uibModalInstance.dismiss).toHaveBeenCalled();
  });

  it('should let user open start date picker', function() {
    expect(scope.openStart).toBeDefined();
    expect(typeof scope.openStart).toBe('function');
    scope.openStart();
    expect(scope.popupStart.opened).toBe(true);
  });

  it('should let user open end date picker', function() {
    expect(scope.openEnd).toBeDefined();
    expect(typeof scope.openEnd).toBe('function');
    scope.openEnd();
    expect(scope.popupEnd.opened).toBe(true);
  });
});
