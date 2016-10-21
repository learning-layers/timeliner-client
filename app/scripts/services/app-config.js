'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.appConfig
 * @description
 * # appConfig
 * Constant in the timelinerApp.
 */
angular.module('timelinerApp')
  .constant('appConfig', {
    authCookieName: 'timelinerAuth',
    backendUrl: 'http://localhost:3000',
    socketIo: {
      url: 'http://localhost:3000',
      path: '/socket.io'
    },
    reCaptchaPublicKey: '6LcCeh4TAAAAAFyRlnJI_2_gvrQy7KD6R0YdwY80',
    gaTrackingId: '',
    paginationSize: 50,
    uploadFileSizeLimit: 20971520
  });
