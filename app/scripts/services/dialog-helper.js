'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.dialogHelper
 * @description
 * # dialogHelper
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('dialogHelper', function ($mdDialog) {
    return {
      getUseFullScreen: function() {
        return true;
      },
      openProjectEditDialog: function(project, ev) {
        return $mdDialog.show({
          controller: 'CreateUpdateProjectDialogCtrl',
          templateUrl: 'views/templates/create-update-project-dialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: false,
          fullscreen: this.getUseFullScreen(),
          locals: {
            project: project
          }
        });
      }
    };
  });
