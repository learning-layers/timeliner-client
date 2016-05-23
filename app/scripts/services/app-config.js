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
    reCaptchaPublicKey: '6LcCeh4TAAAAAFyRlnJI_2_gvrQy7KD6R0YdwY80'
  });
