'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.projects
 * @description
 * # projects
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('ProjectsService', function ($resource, appConfig, AuthService, _) {

    var apiLocation = appConfig.backendUrl + '/api/projects';

    var projectsResource =  $resource(apiLocation, {}, {
      all: {
        url: apiLocation,
        method: 'GET'
      },
      mine: {
        url: apiLocation + '/mine',
        method: 'GET'
      },
      create: {
        url: apiLocation,
        method: 'POST'
      },
      get: {
        url: apiLocation + '/:id',
        key: '@id',
        method: 'GET'
      },
      accept: {
        url: apiLocation + '/:id/participants/accept',
        key: '@id',
        method: 'POST'
      },
      reject: {
        url: apiLocation + '/:id/participants/reject',
        key: '@id',
        method: 'POST'
      },
      hide: {
        url: apiLocation + '/:id/timeline/hide',
        method: 'POST'
      },
      show: {
        url: apiLocation + '/:id/timeline/show',
        method: 'POST'
      }
    });

    // Public API here
    return {
      findCurrentParticipant: function(project) {
        var currentUser = AuthService.getCurrentUser();

        return _.find(project.participants, function(participant) {
          return participant.user._id === currentUser._id;
        });
      },
      isShownOnTimeline: function(project) {
        var currentParticipant = this.findCurrentParticipant(project);

        return !!currentParticipant.showOnTimeline;
      },
      create: projectsResource.create,
      mine: projectsResource.mine,
      all: projectsResource.all,
      accept: projectsResource.accept,
      reject: projectsResource.reject,
      hide: projectsResource.hide,
      show: projectsResource.show
    };
  });
