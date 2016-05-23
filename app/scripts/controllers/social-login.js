'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:SocialLoginCtrl
 * @description
 * # SocialLoginCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('SocialLoginCtrl', function ($log, $state, $stateParams, AuthService, SystemMessagesService) {
    AuthService.loginSocial({
      state: $stateParams.state
    }, function(response) {
      $log.log('Social Login Successful', response);
      AuthService.setAuthCookie({
        authToken: response.data.token
      });
      AuthService.setCurrentUser(response.data.user);
      SystemMessagesService.showSuccess('Welcome back ' + response.data.user.name.first + ' ' + response.data.user.name.last + ', you have successfully logged in.');
      $state.go('home');
    }, function(response) {
      $log.error('Social Login Failed', response);
      // TODO Add some error handling
      SystemMessagesService.showError('Login failed.');
      $state.go('login');
    });
  });
