'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectTimeline
 * @description
 * # projectTimeline
 */
angular.module('timelinerApp')
  .directive('projectTimeline', function ($log, $window, _) {
    var timelineOptions = {
      groupOrder: 'position',
      zoomMax: 1.578e+11, // 5 years
      zoomMin: 2.63e+9, // 1 month
      editable: {
        add: true,
        remove: false,
        updateGroup: false,
        updateTime: true
      }
    };

    function generateIconHtml(type, color, title) {
      var styles = [];

      if ( color ) {
        styles.append('color:' + color);
      }
      if ( !title ) {
        title = '';
      }

      return '<span class="icon-' + type + '"' + ( ( styles.length > 0 ) ? ' styles="' + styles.join(';') + '"' : '' ) + ( ( title ) ? 'title="' + title + '"' : '' ) +'></span>';
    }

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        $log.debug(scope, element, attrs);
        var timeline = null;

        timelineOptions.onAdd = function(item, callback) {
          scope.$emit('timeliner:timeline:item:add', {
            item: item,
            callback: function(item) {
              if ( item.group === 'timeline-annotations' ) {
                item.className = 'tl-project-timeline-annotation';
                item.content = generateIconHtml('note');
                item.type = 'point';
                item.editable = true;
              }
              callback(item);
            }
          });
        };

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

          if ( scope.data.annotations.length > 0 ) {
            _(scope.data.annotations).each(function(annotation) {
              items.add({
                className: 'tl-project-timeline-annotation',
                content: generateIconHtml('note'),
                group: 'timeline-annotations',
                id: annotation._id,
                start: new Date(annotation.date),
                title: annotation.title,
                type: 'point',
                editable: true
              });
            });
          }

          timeline.setData({
            groups: groups,
            items: items
          });

        });
      }
    };
  });
