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
      update: {
        url: apiLocation + '/:id',
        method: 'PUT'
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
      },
      getProjectAnnotations: {
        url: apiLocation + '/:project/annotations'
      },
      createAnnotation: {
        url: apiLocation + '/:project/annotations',
        method: 'POST'
      },
      updateAnnotation: {
        url: apiLocation + '/:project/annotations/:id',
        method: 'PUT'
      },
      deleteAnnotation: {
        url: apiLocation + '/:project/annotations/:id'
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
      get: projectsResource.get,
      update: projectsResource.update,
      mine: projectsResource.mine,
      all: projectsResource.all,
      accept: projectsResource.accept,
      reject: projectsResource.reject,
      hide: projectsResource.hide,
      show: projectsResource.show,
      getProjectAnnotations: projectsResource.getProjectAnnotations,
      createAnnotation: projectsResource.createAnnotation,
      updateAnnotation: projectsResource.updateAnnotation,
      deleteAnnotation: projectsResource.deleteAnnotation
    };
  });
