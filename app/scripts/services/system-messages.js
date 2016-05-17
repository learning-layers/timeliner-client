'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.SystemMessagesService
 * @description
 * # systemMessages
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('SystemMessagesService', function ($mdToast) {
    var position = 'top right',
        types = ['info', 'success', 'warning', 'error'];

    return {
      show: function(type, text) {
        if (types.indexOf(type) === -1 ) {
          type = types[0];
        }

        $mdToast.show(
          $mdToast.simple()
            .textContent(text)
            .position(position)
            .theme(type + '-toast')
        );
      },
      showInfo: function(text) {
        this.show('info', text);
      },
      showSuccess: function(text) {
        this.show('success', text);
      },
      showWarning: function(text) {
        this.show('warning', text);
      },
      showError: function(text) {
        this.show('error', text);
      }
    };
  });
