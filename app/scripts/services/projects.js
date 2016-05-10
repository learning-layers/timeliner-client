'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.projects
 * @description
 * # projects
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('ProjectsService', function ($resource, appConfig) {

    var apiLocation = appConfig.backendApiUrl + '/projects';

    var projectsResource =  $resource(apiLocation, {}, {
      mine: {
        url: apiLocation,
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
      }
    });

    // Public API here
    return {
      create: projectsResource.create,
      mine: projectsResource.mine
    };
  });
