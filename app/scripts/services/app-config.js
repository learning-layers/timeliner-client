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
    backendApiUrl: 'http://localhost:3000/api',
    reCaptchaPublicKey: '6LcCeh4TAAAAAFyRlnJI_2_gvrQy7KD6R0YdwY80'
  });
