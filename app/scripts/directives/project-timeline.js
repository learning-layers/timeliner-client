'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectTimeline
 * @description
 * # projectTimeline
 */
angular.module('timelinerApp')
  .directive('projectTimeline', function ($log, $window, $sanitize, $timeout, _, UsersService, ProjectsService) {
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
        var maxZindex = 2;
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

          timeline.setData({
            groups: groups,
            items: items
          });

        });
      }
    };
  });
