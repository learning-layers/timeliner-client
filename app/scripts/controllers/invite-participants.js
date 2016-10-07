'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:InviteParticipantsCtrl
 * @description
 * # InviteParticipantsCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('InviteParticipantsCtrl', function ($log, UsersService, ProjectsService, SystemMessagesService) {
    var self = this;

    function querySearch(text) {
      return UsersService.searchByNameOrEmail({
        text: text
      }).$promise.then(function(response) {
        return response.data;
      });
    }

    function canInviteParticipant() {
      return self.selectedItem && !self.isDisabled;
    }

    function inviteParticipant() {
      self.isDisabled = true;

      ProjectsService.invite({
        id: ProjectsService.getCurrentProject()._id,
        user: self.selectedItem._id
      }, {},function() {
        self.isDisabled = false;
      }, function(err) {
        self.isDisabled = false;
        SystemMessagesService.showError(SystemMessagesService.getTranslatableMessageFromError(err));
      });
    }

    self.isDisabled = false;
    self.noCache = true;

    self.querySearch = querySearch;
    self.canInviteParticipant = canInviteParticipant;
    self.inviteParticipant = inviteParticipant;
  });
