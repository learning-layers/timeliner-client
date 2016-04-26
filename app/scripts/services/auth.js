'use strict';

angular.module('timelinerApp')
  .factory('AuthService', function AuthFactory($resource, $http, $cookies, appConfig){
    var authCookieName = appConfig.authCookieName;

    function getAuthCookie() {
      var cookie = $cookies.getObject(authCookieName);

      return cookie ? cookie : null;
    }

    function setAuthCookie (dataObject) {
      $cookies.putObject(authCookieName, dataObject);
    }

    function removeAuthCookie () {
      $cookies.remove(authCookieName);
    }

    function hasAuthCookie () {
      return !!getAuthCookie();
    }

    function getAuthToken () {
      if ( hasAuthCookie() ) {
        var cookie = getAuthCookie();

        return cookie.authToken;
      }

      return null;
    }

    function getUserId () {
      var authToken = getAuthToken();

      if ( authToken ) {
        var dataObject = JSON.parse(atob(authToken.split('.')[1]));

        return dataObject.sub;
      }

      return null;
    }

    if ( hasAuthCookie() ) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + getAuthToken();
    }

    $http.defaults.headers.patch = { 'Content-Type': 'application/json;charset=utf-8' };

    var apiLocation = appConfig.backendApiUrl + '/auth';

    var authResource =  $resource(apiLocation, {}, {
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
      },
      login: {
        url: apiLocation + '/login',
        method: 'POST'
      }
    });

    return {
      getAuthCookie: getAuthCookie,
      setAuthCookie: setAuthCookie,
      removeAuthCookie: removeAuthCookie,
      register: authResource.register,
      confirm: authResource.confirm,
      checkConfirmationKeyValidity: authResource.checkConfirmationKeyValidity,
      login: authResource.login,
      isLoggedIn: function() {
        if ( hasAuthCookie ) {
          if ( getAuthToken() && getUserId() ) {
            return true;
          }
        }

        return false;
      }
    };

  });
