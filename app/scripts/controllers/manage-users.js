'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageUsersCtrl
 * @description
 * # ManageUsersCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageUsersCtrl', function ($scope, $log, UsersService, AuthService) {
    $scope.showUserProfile = function(user, event) {
      // TODO Implement me
      console.log('showUserProfile', user, event);
    };

    $scope.addRemoveAdmin = function(user) {
      UsersService.manageAdmin({
        user: user._id
      }, {
        isAdmin: ( user.isAdmin ) ? false : true
      }, function(response) {
        if ( response.data._id === user._id ) {
          user.isAdmin = response.data.isAdmin;
        }
      }, function(response) {
        // TODO Make sure to notify user in case of errors
        $log.debug('Error', response);
      });
    };

    $scope.isAdminActionDisabled = function(user) {
      var currentUser = AuthService.getCurrentUser();

      return currentUser._id === user._id;
    };

    UsersService.all({}, function(response) {
      $scope.users = response.data;
    }, function(response) {
      $log.debug('Error', response);
    });
  });
