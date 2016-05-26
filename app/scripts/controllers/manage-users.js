'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageUsersCtrl
 * @description
 * # ManageUsersCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageUsersCtrl', function ($scope, $state, $log, UsersService) {
    $scope.goBack = function() {
      $state.go('manage.main');
    };

    $scope.getFullName = function(user) {
      return UsersService.getFullName(user);
    };

    $scope.showUserProfile = function(user, event) {
      // TODO Implement me
      console.log('showUserProfile', user, event);
    };

    $scope.addRemoveAdmin = function(user, event) {
      // TODO Implement me
      console.log('addRemoveAdmin', user, event);
    };

    UsersService.all({}, function(response) {
      $scope.users = response.data;
    }, function(response) {
      $log.debug('Error', response);
    });
  });
