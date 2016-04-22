angular.module("timelinerApp")
  .factory("AuthService", function AuthFactory($resource, $http){
    $http.defaults.headers.patch = {'Content-Type': 'application/json;charset=utf-8'};

    var apiLocation = 'http://localhost:3000/api/auth';

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
