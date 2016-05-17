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
    'ui.router',
    'htk.common',
    'ui.bootstrap',
    'vcRecaptcha',
    'ngMaterial',
    'ngMessages'
  ]);

angular.module('timelinerApp')
  .run(['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeSuccess', function() {
      var title = getTitleValue($state.$current.locals.globals.$title);
      $timeout(function () {
        document.title = title;
      });
    });

    function getTitleValue(title) {
      var titlePrefix = 'Timeliner - ';
      return titlePrefix + title;
    }
  }])
  .config(function($mdThemingProvider) {
    $mdThemingProvider
      .theme('default')
      .dark()
      .primaryPalette('blue-grey', {
        'default': '500',
        'hue-1': '700'
      })
      .backgroundPalette('blue-grey', {
        'default': '800',
        'hue-1': '900'
      })
      .accentPalette('green');
      $mdThemingProvider.theme('info-toast');
      $mdThemingProvider.theme('success-toast');
      $mdThemingProvider.theme('warning-toast');
      $mdThemingProvider.theme('error-toast');
  })
  .config(function ($mdDateLocaleProvider, $windowProvider) {
    var $window = $windowProvider.$get();

    $mdDateLocaleProvider.formatDate = function(date) {
      if(date){
        return $window.moment(date).format('DD.MM.YYYY');
      }
      return date;
    };
    $mdDateLocaleProvider.firstDayOfWeek = 1;
  });
