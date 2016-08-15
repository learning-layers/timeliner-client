'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:CreateNewAnnotationModalInstanceCtrl
 * @description
 * # CreateNewAnnotationModalInstanceCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('CreateNewAnnotationModalInstanceCtrl', function ($scope, $mdDialog, $log, project, date, ProjectsService, SystemMessagesService) {
    $scope.updating = false;

    $scope.model = {
      title: '',
      description: '',
      date: ( date ) ? date: new Date()
    };

    $scope.submit = function() {
      $scope.updating = true;
      ProjectsService.createAnnotation({
        project: project._id
      }, {
        title: $scope.model.title,
        description: $scope.model.description,
        date: $scope.model.date
      }, function(response) {
        $log.debug('Annotation creation success', response);
        $scope.updating = false;
        $mdDialog.hide(response.data);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.ANNOTATION_CREATED');
      }, function(err) {
        $log.error('Annotation creation error', err);
        $scope.updating = false;
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });