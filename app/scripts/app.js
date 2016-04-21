'use strict';

/**
 * @ngdoc overview
 * @name timelinerApp
 * @description
 * # timelinerApp
 *
 * Main module of the application.
 */
angular
  .module('timelinerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ]);

angular.module('timelinerApp')
  .run(['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {
    $rootScope.$on("$stateChangeSuccess", function() {
      var title = getTitleValue($state.$current.locals.globals.$title);
      $timeout(function () {
        document.title = title;
      });
    });

    function getTitleValue(title) {
      var titlePrefix = 'Timeliner - ';
      return titlePrefix + title;
    }
  }]);
