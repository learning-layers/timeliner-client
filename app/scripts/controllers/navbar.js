'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('NavbarCtrl', function ($scope, $state, AuthService, UsersService, $translate, ProjectsService, $log, dialogHelper, SocketService, $timeout) {
    var maxReconnectAttempts = 50;
    var socketConnected = false;
    var socketReconnecting = false;
    var socketDisconnected = false;
    var reconnectAttempt = 0;

    SocketService.on('connect', function() {
      socketConnected = true;
      socketDisconnected = false;
      socketReconnecting = false;
      reconnectAttempt = 0;
    });
    SocketService.on('disconnect', function() {
      socketConnected = false;
      socketReconnecting = false;
      socketDisconnected = true;
      reconnectAttempt = 0;
    });
    SocketService.on('reconnect', function() {
      socketReconnecting = true;
    });
    SocketService.on('reconnecting', function(attempt) {
      socketReconnecting = true;
      reconnectAttempt = attempt;
    });
    SocketService.on('reconnect_failed', function() {
      socketReconnecting = false;
    });

    $scope.logout = function() {
      AuthService.removeAuthCookie();
      // XXX Need to contact service and notify about logout
      // Allow other socket operation to finish before triggering logout
      $timeout(function() {
        SocketService.emit('logout');
      }, 3000);
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

    $scope.hasSocketConnectionIssues = function() {
      return !socketConnected;
    };

    $scope.isSocketReconnecting = function() {
      return socketReconnecting && reconnectAttempt <= maxReconnectAttempts;
    };

    $scope.isSocketDisconnected = function() {
      return socketDisconnected || ( socketReconnecting && reconnectAttempt > maxReconnectAttempts);
    };
  });
