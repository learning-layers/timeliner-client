'use strict';

angular.module('timelinerApp')
  .factory('AuthService', function AuthFactory($resource, $http, appConfig){
    $http.defaults.headers.patch = { 'Content-Type': 'application/json;charset=utf-8' };

    var apiLocation = appConfig.backendApiUrl + '/auth';

    return $resource(apiLocation, {}, {
      register: {
        url: apiLocation + '/register',
        method: 'POST'
      },
      confirm: {
        url: apiLocation + '/confirm',
        method: 'POST'
      },
      checkConfirmationKeyValidity: {
        url: apiLocation + '/confirm/:key',
        key: '@key',
        method: 'GET'
      }
    });

  });
