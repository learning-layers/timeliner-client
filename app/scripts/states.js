'use strict';

angular.module('timelinerApp').config(function($stateProvider, $urlRouterProvider){

  // For any unmatched url, send to /
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        $title: function() { return 'Welcome'; }
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      resolve: {
        $title: function() { return 'About'; }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      resolve: {
        $title: function() { return 'Log in'; }
      }
    })
    .state('login.auth', {
      url: '/:state',
      resolve: {
        $title: function() { return 'Log in'; }
      }
    })
    .state('confirm', {
      url: '/confirm/:key',
      templateUrl: 'views/confirmation.html',
      controller: 'ConfirmationCtrl',
      resolve: {
        $title: function() { return 'Complete your profile'; }
      }
    })
    .state('manage', {
      abstract: true,
      url: '/manage',
      templateUrl: 'views/manage.html',
      controller: 'ManageCtrl'
    })
    .state('manage.overview', {
      url: '',
      templateUrl: 'views/manage-overview.html',
      controller: 'ManageOverviewCtrl',
      resolve: {
        $title: function() { return 'Manage Overview'; }
      },
      requireAdmin: true
    })
    .state('manage.users', {
      url: '/users',
      templateUrl: 'views/manage-users.html',
      controller: 'ManageUsersCtrl',
      resolve: {
        $title: function() { return 'Manage Users'; }
      },
      requireAdmin: true
    })
    .state('manage.projects', {
      url: '/projects',
      templateUrl: 'views/manage-projects.html',
      controller: 'ManageProjectsCtrl',
      resolve: {
        $title: function() { return 'Manage Projects'; }
      },
      requireAdmin: true
    });

}).run(function($rootScope, $state, AuthService, SystemMessagesService) {
  function ensureAdmin(event) {
    if ( !AuthService.isAdminLoggedIn() ) {
      $state.transitionTo('home');
      event.preventDefault();
      SystemMessagesService.showWarning('Administrator privileges required!');
    }
  }

  // Possible arguments: event, toState, toParams, fromState, fromParams
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if ( toState.requireAdmin ) {
      if ( !AuthService.getCurrentUser() ) {
        $rootScope.$on('$tlCurrentUserLoaded', function() {
          ensureAdmin(event);
        });
      } else {
        ensureAdmin(event);
      }
    }
  });
});
