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
      function getFullTitle(title) {
        var titlePrefix = 'Timeliner - ';
        return titlePrefix + title;
      }

      $timeout(function () {
        $translate($state.$current.locals.globals.$title).then(function (translation) {
          document.title = getFullTitle(translation);
        });
      });

    });
  }])
  .config(function($mdThemingProvider) {
    var tlPalette = $mdThemingProvider.extendPalette('blue-grey', {
      '50': 'd5d5d7',
      '100': 'c0c1c3',
      '200': 'abacaf',
      '300': '96989b',
      '400': '818387',
      '500': '6c6e73',
      '600': '575a5f',
      '700': '42454b',
      '800': '2e3138',
      '900': '222222'
    });

  $mdThemingProvider.definePalette('tlPalette', tlPalette);

    $mdThemingProvider
      .theme('default')
      .dark()
      .primaryPalette('tlPalette', {
        'default': '500',
        'hue-1': '900',
        'hue-3': '700'
      })
      .backgroundPalette('tlPalette', {
        'default': '800',
        'hue-1': '900'
      })
      .accentPalette('light-blue');
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
  })
  .config(['$mdAriaProvider', function ($mdAriaProvider) {
    $mdAriaProvider.disableWarnings();
  }]);
