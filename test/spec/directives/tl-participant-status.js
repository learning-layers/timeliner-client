'use strict';

describe('Directive: tlParticipantStatus', function () {

  // load the directive's module
  beforeEach(module('timelinerApp'));

  var element,
    scope,
    participant;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
    participant = {
      status: 'active'
    };
    scope.participant = participant;
  }));

  it('should have participant and status classes set', inject(function ($compile) {
    element = angular.element('<img tl-participant-status="participant">');
    element = $compile(element)(scope);
    expect(element.hasClass('tl-participant')).toBe(true);
    expect(element.hasClass('tl-participant-' + participant.status)).toBe(true);
  }));
});
