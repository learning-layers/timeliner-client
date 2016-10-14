'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:InviteParticipantsCtrl
 * @description
 * # InviteParticipantsCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('InviteParticipantsCtrl', function ($log, UsersService, ProjectsService, SystemMessagesService, _) {
    var self = this;

    function querySearch(text) {
      return UsersService.searchByNameOrEmail({
      }, {
        search: text,
        exclude: _(ProjectsService.getCurrentProject().participants).map(function(participant) {
          return participant.user._id;
        })
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

    function getSelectedItemText(item) {
      return UsersService.getFullName(item) + ' (' + item.email + ')';
    }

    self.isDisabled = false;
    self.noCache = true;

    self.querySearch = querySearch;
    self.canInviteParticipant = canInviteParticipant;
    self.inviteParticipant = inviteParticipant;
    self.getSelectedItemText = getSelectedItemText;
  });
