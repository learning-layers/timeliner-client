'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlPreventParentScroll
 * @description
 * # tlPreventParentScroll
 */
angular.module('timelinerApp')
  .directive('tlPreventParentScroll', function () {
    // Current solution is fully taken from here: http://stackoverflow.com/questions/5802467/prevent-scrolling-of-parent-element
    return {
      restrict: 'A',
      scope: false,
      link: function postLink(scope, element) {
        function onMouseWheel(ev) {
            element[0].scrollTop -= (ev.originalEvent.wheelDeltaY || ev.originalEvent.wheelDelta || 0);
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
        }
        element.on('mousewheel', onMouseWheel);
      }
    };
  });
