'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('NavbarCtrl', function ($scope, $state, AuthService, UsersService, $translate, ProjectsService, $log, dialogHelper) {
    $scope.logout = function() {
      AuthService.removeAuthCookie();
      $state.go('home');
    };

    $scope.changeLanguage = function (lang) {
      $translate.use(lang);
    };

    $scope.manage = function() {
      $state.go('manage.overview');
    };

    $scope.isCurrentUserLoaded = function() {
      return !!AuthService.getCurrentUser();
    };

    $scope.getCurrentUserName = function() {
      var currentUser = AuthService.getCurrentUser();

      return UsersService.getFullName(currentUser);
    };

    $scope.getCurrentUserImage = function() {
      var currentUser = AuthService.getCurrentUser();

      return UsersService.getImage(currentUser);
    };

    $scope.hasCurrentProject = function() {
      return !!ProjectsService.getCurrentProject();
    };

    $scope.getCurrentProject = function() {
      return ProjectsService.getCurrentProject();
    };

    $scope.editCurrentProject = function(ev) {
      var dialogPromise = dialogHelper.openProjectEditDialog($scope.getCurrentProject(), ev);

      dialogPromise.then(function(project) {
        $log.debug('Dialog returned project:', project);
      }, function() {
        $log.debug('Dialog dismissed.');
      });
    };
  });
