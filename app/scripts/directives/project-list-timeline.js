'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectListTimeline
 * @description
 * # projectListTimeline
 */
angular.module('timelinerApp')
  .directive('projectListTimeline', function ($log, $window, $sanitize, _, UsersService) {
    var timelineOptions = {
      groupOrder: 'position',
      zoomMax: 1.578e+11, // 5 years
      zoomMin: 2.63e+9 // 1 month
    };

    function buildItemContent(project) {
      // TODO Consider using a template
      return '<div class="tl-timeline-project-content">' +
        '<div class="tl-timeline-project-title">' + $sanitize(project.title) + '</div>' +
        '<div class="tl-timeline-project-participants">' +
          _(project.participants).map(function(participant) {
            return '<img src="' + UsersService.getImage(participant.user) + '"  alt="participant" class="tl-timeline-participant" title="' + $sanitize(UsersService.getFullName(participant.user)) + '" />';
          }).join('') +
        '</div>' +
      '</div>';
    }

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

          angular.forEach(scope.data, function(project) {
            groups.add({
              className: 'tl-timeline-project-group',
              content: project.title, // XXX Need to generate some
              id: project._id,
              title: project.title
            });
            items.add({
              className: 'tl-timeline-project',
              content: buildItemContent(project),
              end: project.end ? project.end : timeline.getWindow().end,
              group: project._id,
              id: project._id,
              start: project.start,
              title: project.title,
              type: 'range',
              editable: false,
              hasEnd: project.end ? true : false
            });
          });

          timeline.setData({
            groups: groups,
            items: items
          });

          timeline.on('rangechanged', function(data) {
            var ids = items.getIds({
              filter: function(item) {
                return item.hasEnd === false;
              }
            });
            if ( ids.length > 0 ) {
              angular.forEach(ids, function(id) {
                items.update({ id: id, end: data.end });
              });
              timeline.redraw();
            }
          });
        });
      }
    };
  });
