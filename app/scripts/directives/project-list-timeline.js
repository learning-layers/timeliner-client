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
      zoomMin: 2.63e+9, // 1 month
      selectable: false
    };

    function determineFull(containerWidth, elementWidth, elementsCount, factor) {
      if ( factor < 2 ) {
        throw new Error('Factor is required to be greater or equal to two, instead a value of ' + factor.toString() + ' was provided!');
      }

      if ( elementsCount === 1 ) {
        return 1;
      } else if ( ( elementsCount * elementWidth ) <= containerWidth ) {
        return elementsCount;
      } else {
        var leftWidth = containerWidth - ( ( elementsCount + ( factor - 1 ) ) * ( elementWidth / factor ) );

        if ( leftWidth >= elementWidth / factor  * ( factor - 1 ) ) {
          var additionalFullElements = Math.floor( ( leftWidth / ( elementWidth / factor * ( factor - 1 ) ) ) );

          return additionalFullElements + 1;
        }
      }

      return 1;
    }

    function findAndApply(element) {
      var factor = 10;
      var elements = angular.element(element[0].querySelectorAll('.tl-timeline-project'));

      if ( elements && elements.length > 0 ) {
        _(elements).each(function(singleProjectElement) {
          var imageElements = angular.element(singleProjectElement.querySelectorAll('img.tl-timeline-participant'));
          if ( imageElements && imageElements.length > 1 ) {
            var containerWidth = singleProjectElement.clientWidth;
            //var imageElementWidth = imageElements[0].clientWidth;
            // TODO It does not count for margins
            var imageElementWidth = imageElements[0].offsetWidth;
            // This accounts for contained nested element margins
            var fullCount = determineFull(containerWidth - 10, imageElementWidth + 2, imageElements.length, factor);
            _(imageElements).each(function(imageElement, index) {
              imageElement.style.position = 'relative';
              imageElement.style.zIndex = imageElements.length - index;
              if ( index >= fullCount ) {
                imageElement.style.left = '-' + ( imageElementWidth * ( index + 1 - fullCount ) / factor * ( factor - 1 ) ) + 'px';
              } else {
                imageElement.style.left = '0px';
              }
            });
          }
        });
      }
    }

    function buildItemContent(project) {
      return '<div class="tl-timeline-project-content">' +
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

          angular.forEach(scope.data, function(project) {
            if ( maxZindex < project.participants.length ) {
              maxZindex = project.participants.length;
            }

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

          var findAndApplyTimeout;

          timeline.on('rangechanged', function(data) {
            timeline.once('changed', function() {
              if ( findAndApplyTimeout ) {
                clearTimeout(findAndApplyTimeout);
                findAndApplyTimeout = null;
              }
              findAndApplyTimeout = setTimeout(function() {
                findAndApply(element);
              }, 50);
            });

            angular.element(element[0].querySelector('.vis-current-time'))[0].style.zIndex = maxZindex + 1;

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
