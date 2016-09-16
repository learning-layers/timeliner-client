'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:projectTimeline
 * @description
 * # projectTimeline
 */
angular.module('timelinerApp')
  .directive('projectTimeline', function ($log, $window, $sanitize, _, $translate, ProjectsService, UsersService, $) {
    var timelineOptions = {
      groupOrder: 'order',
      zoomMax: 1.578e+11, // 5 years
      zoomMin: 8.64e+7, // 1 day
      editable: {
        add: true,
        remove: false,
        updateGroup: false,
        updateTime: true
      },
      dataAttributes: ['tl-drop-id', 'tl-drop-type']
    };
    var outcomeIndex = 2;
    var outcomeColor = 1;

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

    function getMainDropElement(target) {
      if(target.dataset.tlDropId){
        return target;
      } else {
        return $(target).parents('[data-tl-drop-id]');
      }
    }

    window.allowDrop = function(ev){
      // TODO check somehow if item is droppable on this element (exists, correct type etc)
      ev.preventDefault();
      $(getMainDropElement(ev.target)).addClass('drop-target');
    };

    window.dragTargetEnd = function(ev){
      $(getMainDropElement(ev.target)).removeClass('drop-target');
    };

    window.objectDropped = function (ev) {
      ev.preventDefault();
      var target = $(getMainDropElement(ev.target));
      target.removeClass('drop-target');
      var dragDropData = {};

      $log.debug(JSON.parse(ev.dataTransfer.getData('application/json')).tlDragType);
      //return;
      dragDropData.dragId = JSON.parse(ev.dataTransfer.getData('application/json')).tlDragId;
      dragDropData.dragType = JSON.parse(ev.dataTransfer.getData('application/json')).tlDragType;
      dragDropData.dropId = target.data('tlDropId');
      dragDropData.dropType = target.data('tlDropType');

      //$log.debug('dropped: ', dragDropData.dragType, dragDropData.dragId, 'on target', dragDropData.dropType, dragDropData.dropId);

      $(document).trigger('tl:timeline:item:addObject', dragDropData);
    };

    window.objectDragStart = function (ev) {
      ev.dataTransfer.setData('application/json', JSON.stringify({
        tlDragId: ev.target.dataset.tlDragId,
        tlDragType: ev.target.dataset.tlDragType
      }));
    };

    function generateParticipantBlockHtml(participants) {
      var html = '<div class="tl-timeline-project-participants">';

      angular.forEach(participants, function (participant) {
       html += '<img src="' + UsersService.getImage(participant.user) + '"  alt="participant" class="tl-timeline-participant" title="' + $sanitize(UsersService.getFullName(participant.user)) + '" />';
      });

      html += '</div>';

      return html;
    }

    function generateTaskDataSetItem(task) {
      return {
        id: task._id,
        className: 'tl-project-timeline-task',
        content: '<div ondragover="allowDrop(event)" ondrop="objectDropped(event)"  ondragleave="dragTargetEnd(event)"><div class="tl-task-title">' + $sanitize(task.title) + '</div>' + generateParticipantBlockHtml(task.participants) + '</div>',
        'tl-drop-id': task._id,
        'tl-drop-type': 'task',
        group: 'timeline-tasks',
        type: 'range',
        start: new Date(task.start),
        end: new Date(task.end),
        title: task.description,
        editable: true
      };
    }

    function getNextOutcomeIndex() {
      return outcomeIndex++;
    }

    function getNextOutcomeColor() {
      if ( outcomeColor <= 6 ) {
        return outcomeColor++;
      } else if ( outcomeColor > 6 ){
        outcomeColor = 1;
      }

      return outcomeColor++;
    }

    function generateOutcomeDataSetItem(outcome, isUpdate) {
      var outcomeItem = {
        content: $sanitize(outcome.title),
        id: 'timeline-outcome-' + outcome._id,
        title: outcome.description
      };

      if ( !isUpdate ) {
        outcomeItem.className = 'tl-project-timeline-outcome tl-outcome-color-' + getNextOutcomeColor();
        outcomeItem.order = getNextOutcomeIndex();
      }

      return outcomeItem;
    }

    function generateVersionDataSetItem(outcomeId, version) {
      return {
        id: version._id,
        outcomeId: outcomeId,
        className: 'tl-project-timeline-outcome-version',
        content: generateIconHtml('file'),
        group: 'timeline-outcome-' + outcomeId,
        start: new Date(version.created),
        title: $sanitize(version.file.name),
        type: 'point',
        editable: false
      };
    }

    function generateOutcomeLifeSpanDataSetItem(outcomeId, start, end) {
      return {
        id: outcomeId + '-life-span',
        className: 'tl-project-timeline-outcome-life-span',
        content: '',
        group: 'timeline-outcome-' + outcomeId,
        start: new Date(start),
        end: new Date(end),
        type: 'background'
      };
    }

    function moveTimeline(timeline, percentage) {
      var range = timeline.getWindow(),
          interval = range.end - range.start;

      timeline.setWindow({
        start: range.start.valueOf() - (interval * percentage),
        end: range.end.valueOf() - (interval * percentage)
      });
    }

    function zoomTimeline(timeline, percentage) {
      var range = timeline.getWindow(),
          interval = range.end - range.start;

      timeline.setWindow({
        start: range.start.valueOf() - (interval * percentage),
        end: range.end.valueOf() + (interval * percentage)
      });
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
          if ( item.group && item.group.startsWith('timeline-outcome-') ) {
            item.id = item.group.replace('timeline-outcome-', '');
            item.group = 'timeline-outcomes';
            scope.$emit('tl:timeline:item:update', item);
          } else {
            scope.$emit('tl:timeline:item:add', item);
          }
        };
        timelineOptions.onUpdate = function(item) {
          if ( item.editable === true ) {
            scope.$emit('tl:timeline:item:update', item);
          } else if ( item.className === 'tl-project-timeline-outcome-version' ) {
            $window.open( ProjectsService.generateOutcomeDownloadUrl(item.outcomeId, item.id), '_blank');
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
            outcomeIndex = 2;
            outcomeColor = 1;
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
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.MILESTONES'),
            order: 1
          });
          groups.add({
            className: 'tl-project-timeline-annotations',
            content: $translate.instant('VIEWS.PROJECT.TIMELINE.ANNOTATIONS'),
            id: 'timeline-annotations',
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.ANNOTATIONS'),
            order: 9998
          });
          groups.add({
            className: 'tl-project-timeline-tasks',
            content: $translate.instant('VIEWS.PROJECT.TIMELINE.TASKS'),
            id: 'timeline-tasks',
            title: $translate.instant('VIEWS.PROJECT.TIMELINE.TASKS'),
            order: 9999
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

          if ( scope.data.outcomes.length > 0 ) {
            _(scope.data.outcomes).each(function(outcome) {
              groups.add(generateOutcomeDataSetItem(outcome, false));

              _(outcome.versions).each(function(version) {
                items.add(generateVersionDataSetItem(outcome._id, version));
              });

              items.add(generateOutcomeLifeSpanDataSetItem(outcome._id, outcome.versions[0].created, outcome.versions[outcome.versions.length-1].created));
            });
          }

          timeline.setData({
            groups: groups,
            items: items
          });

        });

        scope.$on('tl:timeline:move_left', function(ev) {
          ev.preventDefault();
          moveTimeline(timeline, 0.2);
        });
        scope.$on('tl:timeline:move_right', function(ev) {
          ev.preventDefault();
          moveTimeline(timeline, -0.2);
        });
        scope.$on('tl:timeline:zoom_in', function(ev) {
          ev.preventDefault();
          zoomTimeline(timeline, -0.2);
        });
        scope.$on('tl:timeline:zoom_out', function(ev) {
          ev.preventDefault();
          zoomTimeline(timeline, 0.2);
        });
        scope.$on('tl:timeline:fit_to_screen', function(ev) {
          ev.preventDefault();
          timeline.fit();
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

        scope.$on('tl:timeline:add:outcome', function(ev, outcome) {
          ev.preventDefault();
          groups.add(generateOutcomeDataSetItem(outcome, false));

          _(outcome.versions).each(function(version) {
            items.add(generateVersionDataSetItem(outcome._id, version));
          });

          items.add(generateOutcomeLifeSpanDataSetItem(outcome._id, outcome.versions[0].created, outcome.versions[outcome.versions.length-1].created));
        });
        scope.$on('tl:timeline:update:outcome', function(ev, outcome) {
          ev.preventDefault();
          groups.update(generateOutcomeDataSetItem(outcome, true));

          _(outcome.versions).each(function(version) {
            items.update(generateVersionDataSetItem(outcome._id, version));
          });

          items.update(generateOutcomeLifeSpanDataSetItem(outcome._id, outcome.versions[0].created, outcome.versions[outcome.versions.length-1].created));
        });
        scope.$on('tl:timeline:delete:outcome', function(ev, outcome) {
          groups.remove('timeline-outcome-' + outcome._id);

          _(outcome.versions).each(function(version) {
            items.remove(version._id);
          });
          items.remove(outcome._id + '-life-span');
        });
      }
    };
  });
