'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:itemPanelToolbar
 * @description
 * # itemPanelToolbar
 */
angular.module('timelinerApp')
  .directive('itemPanelToolbar', function () {
    return {
      templateUrl: 'views/templates/item-panel-toolbar.html',
      restrict: 'E',
      scope: {
        heading: '=',
        panelId: '='
      },
      link: function postLink(scope) {
        scope.collapsed = false;
        var lastPanelHeight;
        var panel = $('#' + scope.panelId );
        var resizeHandle = panel.find('.ui-resizable-handle');

        scope.togglePanelCollapse = function () {
          if(scope.collapsed) {
            panel.animate({height: lastPanelHeight}, 300);
            resizeHandle.show();
            scope.collapsed = false;
          } else {
            lastPanelHeight = panel.height();
            panel.animate({height: 0}, 300);
            resizeHandle.hide();
            scope.collapsed = true;
          }
        };

        scope.hidePanel = function () {
          panel.hide();
        };
      }
    };
  });
