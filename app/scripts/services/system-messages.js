'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.SystemMessagesService
 * @description
 * # SystemMessagesService
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('SystemMessagesService', function ($mdToast, $translate) {
    var position = 'top right',
        types = ['info', 'success', 'warning', 'error'];

    return {
      show: function(type, text, params, parent) {
        if (types.indexOf(type) === -1 ) {
          type = types[0];
        }

        var toast = $mdToast.simple()
          .textContent($translate.instant(text, params))
          .action($translate.instant('GENERAL.CLOSE'))
          .highlightAction(true)
          .position(position)
          .theme(type + '-toast');

        if ( parent ) {
          toast.parent(parent);
        }

        $mdToast.show(toast);
      },
      showInfo: function(text, params, parent) {
        this.show('info', text, params, parent);
      },
      showSuccess: function(text, params, parent) {
        this.show('success', text, params, parent);
      },
      showWarning: function(text, params, parent) {
        this.show('warning', text, params, parent);
      },
      showError: function(text, params, parent) {
        this.show('error', text, params, parent);
      },
      getTranslatableMessageFromError: function(response) {
        var message;
        if ( response.data && response.data.errors && response.data.errors[0] ) {
          switch(response.data.errors[0].message) {
            case 'required_parameter_missing':
              message = 'TOASTS.ERRORS.REQUIRED_PARAMETER_MISSING';
              break;
            case 'end_date_before_start':
              message = 'TOASTS.ERRORS.END_DATE_BEFORE_START';
              break;
            case 'either_both_dates_or_none':
              message = 'TOASTS.ERRORS.BOTH_DATES_OR_NONE';
              break;
            case 'status_change_by_not_owner':
              message = 'TOASTS.ERRORS.STATUS_CHANGE_BY_NOT_OWNER';
              break;
            case 'already_is_a_participant':
              message = 'TOASTS.ERRORS.AREADY_IS_A_PARTICIPANT';
              break;
            case 'owner_can_not_leave':
              message = 'TOASTS.ERRORS.OWNER_CAN_NOT_LEAVE';
              break;
            case 'owner_can_not_be_removed':
              message = 'TOASTS.ERRORS.OWNER_CAN_NOT_BE_REMOVED';
              break;
            case 'not_a_project_participant':
              message = 'TOASTS.ERRORS.NOT_A_PROJECT_PARTICIPANT';
              break;
            case 'permission_error':
              message = 'TOASTS.ERRORS.PERMISSION_ERROR';
              break;
            case 'not_found':
              message = 'TOASTS.ERROR.NOT_FOUND';
              break;
            case 'either_url_or_file_not_both':
              message = 'TOASTS.ERRORS.URL_OR_FILE';
              break;
            case 'no_url_or_file_provided':
              message = 'TOASTS.ERRORS.REQUIRED_PARAMETER_MISSING';
              break;
            case 'internal_server_error':
              message = 'TOASTS.ERRORS.INTERNAL_SERVER_ERROR';
              break;
            default:
            message = 'TOASTS.ERRORS.INTERNAL_SERVER_ERROR';
          }
        } else {
          switch(response.status) {
            case 400:
              message = 'TOASTS.ERRORS.BAD_REQUEST';
              break;
            case 401:
              message = 'TOASTS.ERRORS.UNAUTHORIZED';
              break;
            case 403:
              message = 'TOASTS.ERRORS.FORBIDDEN';
              break;
            case 404:
              message = 'TOASTS.ERROR.NOT_FOUND';
              break;
            case 405:
              message = 'TOASTS.ERRORS.METHOD_NOT_ALLOWED';
              break;
            case 500:
              message = 'TOASTS.ERRORS.INTERNAL_SERVER_ERROR';
              break;
            default:
              message = 'TOASTS.ERRORS.INTERNAL_SERVER_ERROR';
          }
        }

        return message;
      }
    };
  });
