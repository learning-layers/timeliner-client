'use strict';

/**
 * @ngdoc filter
 * @name timelinerApp.filter:tlDate
 * @function
 * @description
 * # tlDate
 * Filter in the timelinerApp.
 */
angular.module('timelinerApp')
  .filter('tlDate', function ($filter) {
    return function (input, withTime) {
      var dateFormat = 'dd.MM.yyyy';

      if ( withTime ) {
        dateFormat += ' HH:mm';
      }

      if ( input ) {
        return $filter('date')(input, dateFormat);
      }

      return input;
    };
  });
