'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlParticipantStatus
 * @description
 * # tlParticipantStatus
 */
angular.module('timelinerApp')
  .directive('tlParticipantStatus', function () {
    return {
      restrict: 'A',
      scope: {
        participant: '=tlParticipantStatus'
      },
      link: function postLink(scope, element) {
        if ( scope.participant && scope.participant.status ) {
          element.addClass('tl-participant tl-participant-' + scope.participant.status);
        }
      }
    };
  });
