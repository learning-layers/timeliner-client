'use strict';

describe('Controller: CreateNewAnnotationModalInstanceCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var CreateNewAnnotationModalInstanceCtrl,
    scope,
    $mdDialog;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    $mdDialog = jasmine.createSpyObj('$mdDialog', ['hide', 'cancel']);
    CreateNewAnnotationModalInstanceCtrl = $controller('CreateNewAnnotationModalInstanceCtrl', {
      $scope: scope,
      $mdDialog: $mdDialog,
      project: {
        _id: 'id'
      },
      start: new Date()
      // place here mocked dependencies
    });
  }));

  it('should attach a model to the scope', function () {
    expect(scope.model).toBeDefined();
    expect(typeof scope.model).toBe('object');
  });

  // XXX This one makes an AJAX API call, thus, submit will fail
  it('should let the user confirm the modal', function() {
    expect(scope.submit).toBeDefined();
    expect(typeof scope.submit).toBe('function');
    //scope.submit();
    //expect($mdDialog.hide).toHaveBeenCalled();
  });

  it('should let the user dismiss the modal', function() {
    expect(scope.cancel).toBeDefined();
    expect(typeof scope.cancel).toBe('function');
    scope.cancel();
    expect($mdDialog.cancel).toHaveBeenCalled();
  });
});
