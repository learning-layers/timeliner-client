'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectTimeline
 * @description
 * # projectTimeline
 */
angular.module('timelinerApp')
  .directive('projectTimeline', function ($log, $window, $sanitize, _, $translate) {
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
        content: '<div class="tl-annotation-title">' + $sanitize(annotation.title) + '</div>' + generateIconHtml('note'),
        group: 'timeline-annotations',
        type: 'point',
        start: new Date(annotation.start),
        title: annotation.description,
        editable: true
      };
    }

    function generateMilestoneDataSetItem(milestone) {
      return {
        id: milestone._id,
        className: 'tl-project-timeline-milestone tl-milestone-color-' + milestone.color,
        content: '<div class="tl-annotation-title">' + $sanitize(milestone.title) + '</div>' + generateIconHtml('milestone'),
        group: 'timeline-milestones',
        type: 'box',
        start: new Date(milestone.start),
        title: milestone.description,
        editable: true
      };
    }

    function generateTaskDataSetItem(task) {
      return {
        id: task._id,
        className: 'tl-project-timeline-task',
        content: '<div class="tl-task-title">' + $sanitize(task.title) + '</div>',
        group: 'timeline-tasks',
        type: 'range',
        start: task.start,
        end: task.end,
        title: task.description,
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

          // TODO Any translatable texts should be updated once language is changed
          groups.add({
            className: 'tl-project-timeline-milestones',
            content: $translate.instant('VIEWS.PROJECT.TIMELINE.MILESTONES'),
            id: 'timeline-milestones',
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.MILESTONES')
          });
          groups.add({
            className: 'tl-project-timeline-annotations',
            content: $translate.instant('VIEWS.PROJECT.TIMELINE.ANNOTATIONS'),
            id: 'timeline-annotations',
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.ANNOTATIONS')
          });
          groups.add({
            className: 'tl-project-timeline-tasks',
            content: $translate.instant('VIEWS.PROJECT.TIMELINE.TASKS'),
            id: 'timeline-tasks',
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.TASKS')
          });

          if ( scope.data.annotations.length > 0 ) {
            _(scope.data.annotations).each(function(annotation) {
              items.add(generateAnnotationDataSetItem(annotation));
            });
          }

          if ( scope.data.milestones.length > 0 ) {
            _(scope.data.milestones).each(function(milestone) {
              items.add(generateMilestoneDataSetItem(milestone));
            });
          }

          if ( scope.data.tasks.length > 0 ) {
            _(scope.data.tasks).each(function(task) {
              if ( task.start && task.end ) {
                items.add(generateTaskDataSetItem(task));
              }
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

        scope.$on('tl:timeline:add:milestone', function(ev, milestone) {
          ev.preventDefault();
          items.add(generateMilestoneDataSetItem(milestone));
        });
        scope.$on('tl:timeline:update:milestone', function(ev, milestone) {
          ev.preventDefault();
          items.update(generateMilestoneDataSetItem(milestone));
        });
        scope.$on('tl:timeline:delete:milestone', function(ev, milestone) {
          items.remove(milestone._id);
        });
        scope.$on('tl:timeline:move:milestone', function(ev, milestone) {
          items.update({
            id: milestone._id,
            start: milestone.start
          });
        });

        scope.$on('tl:timeline:add:task', function(ev, task) {
          ev.preventDefault();
          if ( task.start && task.end ) {
            items.add(generateTaskDataSetItem(task));
          }
        });
        scope.$on('tl:timeline:update:task', function(ev, task) {
          ev.preventDefault();
          if ( task.start && task.end ) {
            items.update(generateTaskDataSetItem(task));
          } else {
            items.remove(task._id);
          }
        });
        scope.$on('tl:timeline:delete:task', function(ev, task) {
          items.remove(task._id);
        });
        scope.$on('tl:timeline:move:task', function(ev, task) {
          items.update({
            id: task._id,
            start: task.start,
            end: task.end
          });
        });
      }
    };
  });
