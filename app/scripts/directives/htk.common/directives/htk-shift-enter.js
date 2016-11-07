'use strict';

angular.module('htk.common')
  .directive('htkShiftEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13 && !event.shiftKey) {
          scope.$apply(function (){
            scope.$eval(attrs.htkShiftEnter);
          });

          event.preventDefault();
        }
      });
    };
  });
