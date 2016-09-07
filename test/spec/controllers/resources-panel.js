'use strict';

describe('Controller: ResourcesPanelCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var ResourcesPanelCtrl,
    scope,
    fileResource = {
      file: {
        name: 'image.jpg',
        type: 'image/jpeg',
        size: 12345
      }
    },
    urlResource = {
      url: 'http://www.example.com'
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResourcesPanelCtrl = $controller('ResourcesPanelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach methods to the scope', function () {
    expect(scope.openResource).toBeDefined();
    expect(typeof scope.openResource).toBe('function');

    expect(scope.getResourceOpenIcon).toBeDefined();
    expect(typeof scope.getResourceOpenIcon).toBe('function');
  });

  it('should determine resource open icon type', function() {
    expect(scope.getResourceOpenIcon(fileResource)).toBe('file_download');
    expect(scope.getResourceOpenIcon(urlResource)).toBe('open_in_new');
  });
});
