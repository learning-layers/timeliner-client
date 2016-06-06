'use strict';

/**
 * @ngdoc service
 * @name timelinerApp.UsersService
 * @description
 * # users
 * Factory in the timelinerApp.
 */
angular.module('timelinerApp')
  .factory('UsersService', function ($resource, appConfig) {

        var apiLocation = appConfig.backendUrl + '/api/users';

        var usersResource =  $resource(apiLocation, {}, {
          all: {
            url: apiLocation,
            method: 'GET'
          },
          manageAdmin: {
            url: apiLocation + '/:user/manage/admin',
            method: 'PUT',
            params: {
              user: '@user',
            }
          }
        });

        // Public API here
        return {
          all: usersResource.all,
          manageAdmin: usersResource.manageAdmin,
          getFullName: function(user) {
            return ( user && user.name ) ? user.name.first + ' ' + user.name.last : '@unknown';
          },
          getImage: function(user) {
            return user.image ? user.image : 'images/profile128.png';
          }
        };
  });
