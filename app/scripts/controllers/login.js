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
        SystemMessagesService.showSuccess('Welcome back ' + UsersService.getFullName(response.data.user) + ', you have successfully logged in.');
        $state.go('home');
      }, function(response) {
        $scope.updating = false;
        clearProgressInficatorTimeout(timeoutId);

        if ( response.status === 401 ) {
          SystemMessagesService.showError('Authentication failed, please try again!');
        } else {
          SystemMessagesService.showError('Server error, please contact administrator!');
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
        SystemMessagesService.showSuccess('Welcome back ' + UsersService.getFullName(response.data.user) + ', you have successfully logged in.');
        $state.go('home');
      }, function() {
        $scope.updating = false;
        $scope.showProgressIndicator = false;

        // TODO Add some error handling
        SystemMessagesService.showError('Login failed.');
        $state.go('login');
      });
    }

    var locationSearch = $location.search();

    if ( locationSearch.code && locationSearch.message ) {
      if (locationSearch.code === '200' && locationSearch.message === 'user_denied' ) {
        SystemMessagesService.showWarning('Sign in impossible. You have denied the access!');
      } else if ( locationSearch.code === '400' && locationSearch.message === 'bad_request' ) {
        SystemMessagesService.showError('Unable to find authentication response data!');
      } else if ( locationSearch.code === '404' && locationSearch.message === 'could_not_load_profile_data' ) {
        SystemMessagesService.showError('Could not load requested profile data!');
      } else if ( locationSearch.code === '400' && locationSearch.message === 'email_is_missing' ) {
        SystemMessagesService.showError('Email address missing. Please make sure that app is allowed to access email address.');
      } else if ( locationSearch.code === '500' && locationSearch.message === 'internal_server_error' ) {
        SystemMessagesService.showError('Unable to sign you in due to unknown error.');
      } else if ( locationSearch.code === '409' && locationSearch.message === 'email_already_used' ) {
        SystemMessagesService.showError('Email address is already in use.');
      }
    }
  });
