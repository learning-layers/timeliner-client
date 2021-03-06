'use strict';

angular.module('timelinerApp')
  .factory('AuthService', function AuthFactory($resource, $http, $cookies, appConfig){
    var authCookieName = appConfig.authCookieName;
    var currentUser = null;

    function setAuthHeader() {
      if ( getAuthToken() ) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + getAuthToken();
      }
    }

    function removeAuthHeader() {
      if ( $http.defaults.headers.common.Authorization ) {
        delete $http.defaults.headers.common.Authorization;
      }
    }

    function getAuthCookie() {
      var cookie = $cookies.getObject(authCookieName);

      return cookie ? cookie : null;
    }

    function setAuthCookie (dataObject) {
      var options = {};
      var tokenData = JSON.parse(atob(dataObject.authToken.split('.')[1]));

      if ( tokenData.exp ) {
        options.expires = new Date(tokenData.exp * 1000);
      }

      $cookies.putObject(authCookieName, dataObject, options);
      setAuthHeader();
    }

    function removeAuthCookie () {
      $cookies.remove(authCookieName);
      removeAuthHeader();
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

    var apiLocation = appConfig.backendUrl + '/api/auth';

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
      },
      loginSocial: {
        url: apiLocation + '/login/social',
        method: 'POST',
        withCredentials: true
      },
      me: {
        url: apiLocation + '/me',
        method: 'GET'
      },
      requestReset: {
        url: apiLocation + '/reset/request',
        method: 'POST'
      },
      checkPasswordResetKeyValidity: {
        url: apiLocation + '/reset/:key'
      },
      resetPassword: {
        url: apiLocation + '/reset',
        method: 'POST'
      }
    });

    return {
      getAuthCookie: getAuthCookie,
      setAuthCookie: setAuthCookie,
      getAuthToken: getAuthToken,
      removeAuthCookie: removeAuthCookie,
      register: authResource.register,
      confirm: authResource.confirm,
      checkConfirmationKeyValidity: authResource.checkConfirmationKeyValidity,
      login: authResource.login,
      loginSocial: authResource.loginSocial,
      me: authResource.me,
      requestReset: authResource.requestReset,
      checkPasswordResetKeyValidity: authResource.checkPasswordResetKeyValidity,
      resetPassword: authResource.resetPassword,
      isLoggedIn: function() {
        if ( hasAuthCookie ) {
          if ( getAuthToken() && getUserId() ) {
            return true;
          }
        }

        return false;
      },
      isAdminLoggedIn: function() {
        if ( currentUser ) {
          return currentUser.isAdmin;
        }

        return false;
      },
      getCurrentUser: function() {
        return currentUser;
      },
      setCurrentUser: function(user) {
        currentUser = user;
      },
      setCookieAndUser: function(token, user) {
        this.setAuthCookie({
          authToken: token
        });
        this.setCurrentUser(user);
      }
    };

  });
