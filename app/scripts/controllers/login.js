'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('LoginCtrl', function ($window, $scope, $state, AuthService, SystemMessagesService, appConfig) {
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
        AuthService.setAuthCookie({
          authToken: response.data.token
        });
        $scope.model = {};
        AuthService.setCurrentUser(response.data.user);
        SystemMessagesService.showSuccess('Welcome back ' + response.data.user.name.first + ' ' + response.data.user.name.last + ', you have successfully logged in.');
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
  });
