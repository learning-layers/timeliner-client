'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($window, $scope, $state, $location, AuthService, SystemMessagesService, UsersService, appConfig) {
    var timeoutId;

    $scope.updating = false;
    $scope.showProgressIndicator = false;
    $scope.model = {};

    function addProgressIndictorTimeout() {
      return setTimeout(function() {
        $scope.$apply(function(){
           $scope.showProgressIndicator = true;
           timeoutId = null;
         });
      }, 500);
    }

    function clearProgressInficatorTimeout(timeoutId) {
      if ( timeoutId ) {
        clearTimeout(timeoutId);
        timeoutId = null;
      } else {
        $scope.showProgressIndicator = false;
      }
    }

    $scope.login = function() {
      $scope.updating = true;
      timeoutId = addProgressIndictorTimeout();
      AuthService.login({
        email: $scope.model.email,
        password: $scope.model.password
      }, function(response) {
        $scope.updating = false;
        clearProgressInficatorTimeout(timeoutId);
        $scope.model = {};

        AuthService.setCookieAndUser(response.data.token, response.data.user);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.LOGIN_SUCCESS', { FULL_NAME: UsersService.getFullName(response.data.user) });
        $state.go('projects.list');
      }, function(response) {
        $scope.updating = false;
        clearProgressInficatorTimeout(timeoutId);

        if ( response.status === 401 ) {
          SystemMessagesService.showError('TOASTS.ERRORS.AUTHENTICATION_FAILED');
        } else {
          SystemMessagesService.showError('TOASTS.ERRORS.INTERNAL_SERVER_ERROR');
        }
      });
    };

    $scope.socialLogin = function(provider) {
      $scope.updating = true;
      timeoutId = addProgressIndictorTimeout();
      $window.location = appConfig.backendUrl + '/auth/connect/' + provider;
    };

    if ( $state.params.state ) {
      $scope.updating = true;
      $scope.showProgressIndicator = true;

      AuthService.loginSocial({
        state: $state.params.state
      }, function(response) {
        $scope.updating = false;
        $scope.showProgressIndicator = false;

        AuthService.setCookieAndUser(response.data.token, response.data.user);
        SystemMessagesService.showSuccess('TOASTS.SUCCESSES.LOGIN_SUCCESS', { FULL_NAME: UsersService.getFullName(response.data.user) });
        $state.go('projects.list');
      }, function() {
        $scope.updating = false;
        $scope.showProgressIndicator = false;

        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_LOGIN_FAILED');
        $state.go('login');
      });
    }

    var locationSearch = $location.search();

    if ( locationSearch.code && locationSearch.message ) {
      if (locationSearch.code === '200' && locationSearch.message === 'user_denied' ) {
        SystemMessagesService.showWarning('TOASTS.ERRORS.SOCIAL_USER_DENIED');
      } else if ( locationSearch.code === '400' && locationSearch.message === 'bad_request' ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_BAD_REQUEST');
      } else if ( locationSearch.code === '404' && locationSearch.message === 'could_not_load_profile_data' ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_NO_PROFILE');
      } else if ( locationSearch.code === '400' && locationSearch.message === 'email_is_missing' ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_EMAIL_MISSING');
      } else if ( locationSearch.code === '500' && locationSearch.message === 'internal_server_error' ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_SERVER_ERROR');
      } else if ( locationSearch.code === '409' && locationSearch.message === 'email_already_used' ) {
        SystemMessagesService.showError('TOASTS.ERRORS.SOCIAL_EMAIL_IN_USE');
      }
    }
  });
