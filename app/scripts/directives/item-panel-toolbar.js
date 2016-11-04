'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:itemPanelToolbar
 * @description
 * # itemPanelToolbar
 */
angular.module('timelinerApp')
  .directive('itemPanelToolbar', function ($) {
    return {
      templateUrl: 'views/templates/item-panel-toolbar.html',
      restrict: 'E',
      scope: {
        heading: '=',
        panelId: '=',
        collapsed: '='
      },
      link: function postLink(scope) {
        var lastPanelHeight = 150;
        var panel = $('#' + scope.panelId );
        var resizeHandle = panel.find('.ui-resizable-handle');
        resizeHandle.hide(); // Default collapsed and hidden

        scope.togglePanelCollapse = function () {
          if(scope.collapsed) {
            panel.css({zIndex: Number(panel.css('z-index')) + 5 });
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
