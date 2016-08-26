'use strict';

/**
 * Main module declaration
 */

angular.module('htk.common', [])
  .factory('_', ['$window',
    function($window) {
      return $window._;
    }]
  );
