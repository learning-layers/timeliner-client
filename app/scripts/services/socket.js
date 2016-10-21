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
    var socket = $window.io(appConfig.socketIo.url, {
      transports: ['websocket'],
      path: appConfig.socketIo.path
    });

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

    socket.on('connect', function() {
      $log.debug('Socket connected');

      socket.on('authenticate', function(data) {
        $log.debug('Socket authentication response', data);
        if ( data.success !== true ) {
          $log.error('Socket authentication failed', data);
          // TODO It makes sense to notify the user or even close the connection
          // Maybe try reconnecting (although it will most probably be pointless)
        }
      });

      // Make sure socket is authenticated
      if ( AuthService.isLoggedIn() ) {
        socket.emit('authenticate', {
          token: AuthService.getAuthToken()
        });
      }
    });

    // Public API here
    return {
      rawSocket: function() {
        return socket;
      },
      on: function (eventName, callback) {
        function internalCb () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        }

        internalCb.fn = callback;
        socket.on(eventName, internalCb);
      },
      once: function(eventName, callback) {
        function internalCb () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        }

        internalCb.fn = callback;
        socket.once(eventName, internalCb);
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
      },
      off: function(eventName, callback) {
        if ( eventName && callback ) {
          socket.off(eventName, callback);
        } else if ( eventName ) {
          socket.off(eventName);
        } else {
          socket.off();
        }
      },
      authenticate: function() {
        socket.emit('authenticate', {
          token: AuthService.getAuthToken()
        });
      }
    };
  });
