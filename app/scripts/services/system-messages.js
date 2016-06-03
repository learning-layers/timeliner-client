'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.SystemMessagesService
 * @description
 * # systemMessages
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('SystemMessagesService', function ($mdToast, $translate) {
    var position = 'top right',
        types = ['info', 'success', 'warning', 'error'];

    return {
      show: function(type, text, params) {
        if (types.indexOf(type) === -1 ) {
          type = types[0];
        }

        $mdToast.show(
          $mdToast.simple()
            .textContent($translate.instant(text, params))
            .action($translate.instant('GENERAL.CLOSE'))
            .highlightAction(true)
            .position(position)
            .theme(type + '-toast')
        );
      },
      showInfo: function(text, params) {
        this.show('info', text, params);
      },
      showSuccess: function(text, params) {
        this.show('success', text, params);
      },
      showWarning: function(text, params) {
        this.show('warning', text, params);
      },
      showError: function(text, params) {
        this.show('error', text, params);
      }
    };
  });
