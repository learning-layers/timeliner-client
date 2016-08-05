'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectTimeline
 * @description
 * # projectTimeline
 */
angular.module('timelinerApp')
  .directive('projectTimeline', function ($log, $window) {
    var timelineOptions = {
      groupOrder: 'position',
      zoomMax: 1.578e+11, // 5 years
      zoomMin: 2.63e+9, // 1 month
      selectable: false
    };

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        $log.debug(scope, element, attrs);
        var timeline = null;

        // TODO Add handling for updates
        // Full redraw on update does not seems to be reasonable
        scope.$watchCollection('data', function() {
          if ( scope.data === null ) {
            return;
          }

          if ( timeline !== null ) {
            timeline.destroy();
          }

          timeline = new $window.vis.Timeline(element[0]);
          timeline.setOptions(timelineOptions);

          var groups = new $window.vis.DataSet([]);
          var items = new $window.vis.DataSet([]);

          groups.add({
            className: 'tl-project-timeline-milestones',
            content: 'Milestones', // XXX Needs to be translated
            id: 'timeline-milestones',
            title: 'Milestones' // XXX Needs to be translated
          });
          groups.add({
            className: 'tl-project-timeline-annotations',
            content: 'Annotations', // XXX Needs to be translated
            id: 'timeline-annotations',
            title: 'Annotations' // XXX Needs to be translated
          });

          timeline.setData({
            groups: groups,
            items: items
          });

        });
      }
    };
  });
