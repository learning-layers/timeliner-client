'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('MainCtrl', function ($scope, $uibModal, $log) {
    $scope.createNewProject = function() {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/templates/create-new-project-modal.html',
        controller: 'CreateNewProjectModalInstanceCtrl',
      });

      modalInstance.result.then(function(model) {
        $log.log('Modal action called:', model);
      }, function() {
        $log.info('Modal dismissed.');
      });
    };
  });
