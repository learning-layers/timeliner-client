'use strict';

describe('Controller: InviteParticipantsCtrl', function () {

  // load the controller's module
  beforeEach(module('timelinerApp'));

  var InviteParticipantsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InviteParticipantsCtrl = $controller('InviteParticipantsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach logic to the self', function () {
    expect(InviteParticipantsCtrl.querySearch).toBeDefined();
    expect(typeof InviteParticipantsCtrl.querySearch).toBe('function');

    expect(InviteParticipantsCtrl.canInviteParticipant).toBeDefined();
    expect(typeof InviteParticipantsCtrl.canInviteParticipant).toBe('function');

    expect(InviteParticipantsCtrl.inviteParticipant).toBeDefined();
    expect(typeof InviteParticipantsCtrl.inviteParticipant).toBe('function');

    expect(InviteParticipantsCtrl.isDisabled).toBe(false);
    expect(InviteParticipantsCtrl.noCache).toBe(true);
  });
});
