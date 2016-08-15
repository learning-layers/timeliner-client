'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.SocketService
 * @description
 * # SocketService
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('SocketService', function ($rootScope, $window, $log, appConfig, AuthService) {
    var socket = $window.io(appConfig.backendUrl, { transports: ['websocket'] });

    socket.on('connect', function() {
      $log.debug('Socket connected');

      // TODO See if all of these handlers could just be added to the socket
      // Connection would only be used for authenticating and maybe something else
      // Current implementation seems to be registering all the handlers on each connection
      socket.on('error', function(err) {
        $log.debug('Socket error', err);
      });
      socket.on('disconnect', function() {
        $log.debug('Socket disconnected');
        socket.removeAllListeners('authenticate');
      });
      socket.on('reconnect', function(attempt) {
        $log.debug('Socket reconnect', attempt);
      });
      socket.on('reconnecting', function() {
        $log.debug('Socket reconnecting');
      });
      socket.on('reconnect_attempt', function() {
        $log.debug('Socket reconnect attempt');
      });
      socket.on('reconnect_error', function(err) {
        $log.debug('Socket reconnect error', err);
      });
      socket.on('reconnect_failed', function() {
        $log.debug('Socket reconnect failed');
      });
      socket.on('authenticate', function(data) {
        $log.debug('Socket authentication response', data);
      });

      // Make sure socket is authenticated
      socket.emit('authenticate', {
        token: AuthService.getAuthToken()
      });

    });

    // Public API here
    return {
      rawSocket: function() {
        return socket;
      },
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  });
