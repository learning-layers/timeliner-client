'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.ProjectsService
 * @description
 * # ProjectsService
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
        url: apiLocation + '/:project/annotations/:id',
        method: 'DELETE'
      },
      getProjectMilestones: {
        url: apiLocation + '/:project/milestones'
      },
      createMilestone: {
        url: apiLocation + '/:project/milestones',
        method: 'POST'
      },
      updateMilestone: {
        url: apiLocation + '/:project/milestones/:id',
        method: 'PUT'
      },
      deleteMilestone: {
        url: apiLocation + '/:project/milestones/:id',
        method: 'DELETE'
      },
      getProjectTasks: {
        url: apiLocation + '/:project/tasks'
      },
      createTask: {
        url: apiLocation + '/:project/tasks',
        method: 'POST'
      },
      updateTask: {
        url: apiLocation + '/:project/tasks/:id',
        method: 'PUT'
      },
      deleteTask: {
        url: apiLocation + '/:project/tasks/:id',
        method: 'DELETE'
      },
      getProjectResources: {
        url: apiLocation + '/:project/resources'
      },
      createResource: {
        url: apiLocation + '/:project/resources',
        method: 'POST',
        headers: {
          'Content-Type': undefined
        }
      },
      updateResource: {
        url: apiLocation + '/:project/resources/:id',
        method: 'PUT',
        headers: {
          'Content-Type': undefined
        }
      },
      deleteResource: {
        url: apiLocation + '/:project/resources/:id',
        method: 'DELETE'
      },
      getProjectOutcomes: {
        url: apiLocation + '/:project/outcomes'
      },
      createOutcome: {
        url: apiLocation + '/:project/outcomes',
        method: 'POST',
        headers: {
          'Content-Type': undefined
        }
      },
      updateOutcome: {
        url: apiLocation + '/:project/outcomes/:id',
        method: 'PUT',
        headers: {
          'Content-Type': undefined
        }
      },
      deleteOutcome: {
        url: apiLocation + '/:project/outcomes/:id',
        method: 'DELETE'
      },
      addObjectToTask: {
        url: apiLocation + '/:project/tasks/:task/:objectType/:objectId',
        method: 'POST'
      },
      getProjectActivities: {
        url: apiLocation + '/:project/activities'
      },
      getProjectMessages: {
        url: apiLocation + '/:project/messages'
      },
      createMessage: {
        url: apiLocation + '/:project/messages',
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
      getFileIcon: function(file) {
        var icon;

        switch(file.type) {
          // file-check, file-cloud,
          // file-export, file-find, file-hidden, file-import, file-lock,
          // file-multiple, file-outline, file-restore,
          // file-send, file-tree, file-xml
          case 'image/jpeg':
          case 'image/png':
          case 'image/gif':
          case 'image/tiff':
          case 'image/bmp':
          case 'image/x-icon':
          case 'image/svg+xml':
            icon = 'mdi-file-image';
            break;
          case 'application/pdf':
            icon = 'mdi-file-pdf';
            break;
          /*case '':
            icon = 'mdi-file-chart';
            break;*/
          case 'text/csv':
          case 'text/tab-separated-values':
            icon = 'mdi-file-delimited';
            break;
          case 'application/x-abiword':
          case 'text/plain':
            icon = 'mdi-file-document';
            break;
          case 'application/vnd.ms-excel':
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            icon = 'mdi-file-excel';
            break;
          case 'application/vnd.ms-powerpoint':
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            icon = 'mdi-file-powerpoint';
            break;
          case 'application/msword':
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            icon = 'mdi-file-word';
            break;
          case 'application/ogg':
          case 'audio/mp3':
          case 'audio/midi':
          case 'audio/x-m4a':
          case 'audio/amr':
          case 'audio/mpeg':
          case 'audio/wav':
          case 'audio/x-ms-wma':
          case 'audio/x-ms-wmv':
          case 'audio/webm':
          case 'audio/x-aac':
          case 'audio/x-aiff':
          case 'audio/mp4':
            icon = 'mdi-file-music';
            break;
          case 'video/avi':
          case 'video/mpeg':
          case 'video/quicktime':
          case 'video/webm':
          case 'video/x-msvideo':
          case 'video/x-flv':
          case 'video/mp4':
            icon = 'mdi-file-video';
            break;
          default:
            icon = 'mdi-file';
        }

        return icon;
      },
      getResourceIcon: function(resource) {
        var icon = 'mdi-help';

        if ( resource.url ) {
          icon = 'mdi-web';
        } else if ( resource.file ) {
          icon = this.getFileIcon(resource.file);
        }

        return icon;
      },
      generateResourceDownloadUrl: function(resourceId) {
        return  appConfig.backendUrl + '/download/resources/' + resourceId;
      },
      generateOutcomeDownloadUrl: function(outcomeId, versionId) {
        return appConfig.backendUrl + '/download/outcomes/' + outcomeId + '/versions/' + versionId;
      },
      bytesToHumanReadable: function(size, digits) {
        var kb = 1024,
            mb = kb * 1024,
            gb = mb * 1024;

        if ( !digits && digits !== 0 ) {
          digits = 2;
        }

        if ( size > gb ) {
          return (size / gb).toFixed(digits) + ' GB';
        } else if ( size > mb ) {
          return (size / mb).toFixed(digits) + ' MB';
        } else {
          return ( size / kb).toFixed(digits) + ' KB';
        }
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
      deleteAnnotation: projectsResource.deleteAnnotation,
      getProjectMilestones: projectsResource.getProjectMilestones,
      createMilestone: projectsResource.createMilestone,
      updateMilestone: projectsResource.updateMilestone,
      deleteMilestone: projectsResource.deleteMilestone,
      getProjectTasks: projectsResource.getProjectTasks,
      createTask: projectsResource.createTask,
      updateTask: projectsResource.updateTask,
      deleteTask: projectsResource.deleteTask,
      getProjectResources: projectsResource.getProjectResources,
      createResource: projectsResource.createResource,
      updateResource: projectsResource.updateResource,
      deleteResource: projectsResource.deleteResource,
      getProjectOutcomes: projectsResource.getProjectOutcomes,
      createOutcome: projectsResource.createOutcome,
      updateOutcome: projectsResource.updateOutcome,
      deleteOutcome: projectsResource.deleteOutcome,
      addObjectToTask: projectsResource.addObjectToTask,
      getProjectActivities: projectsResource.getProjectActivities,
      getProjectMessages: projectsResource.getProjectMessages,
      createMessage: projectsResource.createMessage
    };
  });
