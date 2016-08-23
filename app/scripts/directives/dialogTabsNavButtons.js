'use strict';

/**
 * Created by sander on 19/08/16.
 */

angular.module('timelinerApp')
  .directive('dialogTabsNavButtons', function(){
    return {
      replace: true,
      restrict: 'E',
      templateUrl: 'views/templates/dialog-tabs-nav-buttons.html',
      scope: {
        firstTab: '@',
        lastTab: '@',
        nextDisabled: '=',
        activeTab: '=',
        submitDisabled: '='
      },
      link: function (scope) {
        scope.nextTab = function () {
          scope.activeTab++;
        };

        scope.prevTab = function () {
          scope.activeTab--;
        };
      }
    };
  });
