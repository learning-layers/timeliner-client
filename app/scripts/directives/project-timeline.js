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

    function generateAnnotationDataSetItem(annotation) {
      return {
        id: annotation._id,
        className: 'tl-project-timeline-annotation',
        content: generateIconHtml('note'),
        group: 'timeline-annotations',
        type: 'point',
        start: new Date(annotation.start),
        title: annotation.title,
        editable: true
      };
    }

    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        $log.debug(scope, element, attrs);
        var timeline = null;
        var items = null;
        var groups = null;

        timelineOptions.onAdd = function(item) {
          scope.$emit('tl:timeline:item:add', item);
        };
        timelineOptions.onUpdate = function(item) {
          if ( item.editable === true ) {
            scope.$emit('tl:timeline:item:update', item);
          }
        };
        timelineOptions.onMove = function(item, callback) {
          if ( item.editable === true ) {
            scope.$emit('tl:timeline:item:move', item);
            callback(item);
          }
        };
        timelineOptions.onRemove = function() {
          // Prevent removal as that should be disabled anyway
        };

        // TODO Add handling for updates
        // Full redraw on update does not seems to be reasonable
        // XXX This one only listens to changes on the main collection, not
        // nested subcollections
        // Explanation: this will probably only rtigger redraw on initial data load
        // or whole contained collections being replaced by new ones
        scope.$watchCollection('data', function() {
          if ( scope.data === null ) {
            return;
          }

          if ( timeline !== null ) {
            // TODO See if the data sets would also need to be destroyed
            // Another way would be to just clear the data sets and reuse old ones
            timeline.destroy();
          }

          timeline = new $window.vis.Timeline(element[0]);
          timeline.setOptions(timelineOptions);

          groups = new $window.vis.DataSet([]);
          items = new $window.vis.DataSet([]);

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
              items.add(generateAnnotationDataSetItem(annotation));
            });
          }

          timeline.setData({
            groups: groups,
            items: items
          });

        });

        scope.$on('tl:timeline:add:annotation', function(ev, annotation) {
          ev.preventDefault();
          items.add(generateAnnotationDataSetItem(annotation));
        });
        scope.$on('tl:timeline:update:annotation', function(ev, annotation) {
          ev.preventDefault();
          items.update(generateAnnotationDataSetItem(annotation));
        });
        scope.$on('tl:timeline:delete:annotation', function(ev, annotation) {
          items.remove(annotation._id);
        });
        scope.$on('tl:timeline:move:annotation', function(ev, annotation) {
          items.update({
            id: annotation._id,
            start: annotation.start
          });
        });
      }
    };
  });
