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
    'vcRecaptcha',
    'ngMaterial',
    'ngMessages',
    'pascalprecht.translate'
  ]);

angular.module('timelinerApp')
  .run(['$rootScope', '$state', '$timeout', '$translate', function ($rootScope, $state, $timeout, $translate) {
    $rootScope.$on('$stateChangeSuccess', function() {

      $timeout(function () {
        $translate($state.$current.locals.globals.$title).then(function (translation) {
          document.title = getFullTitle(translation);
        });
      });

    });

    function getFullTitle(title) {
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
  })
  .config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/locales/locale-',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useSanitizeValueStrategy('sanitize');
    $translateProvider.useMissingTranslationHandlerLog();
  });
