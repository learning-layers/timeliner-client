'use strict';

angular.module('timelinerApp').config(function($stateProvider, $urlRouterProvider){

  // For any unmatched url, send to /
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/landing.html',
      controller: 'RegisterCtrl',
      resolve: {
        $title: function() { return 'TITLES.HOME'; }
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl',
      resolve: {
        $title: function() { return 'TITLES.LOGIN'; }
      }
    })
    .state('login.auth', {
      url: '/:state',
      resolve: {
        $title: function() { return 'TITLES.LOGIN'; }
      }
    })
    .state('confirm', {
      url: '/confirm/:key',
      templateUrl: 'views/confirmation.html',
      controller: 'ConfirmationCtrl',
      resolve: {
        $title: function() { return 'TITLES.CONFIRM'; }
      }
    })
    .state('reset', {
      url: '/reset',
      templateUrl: 'views/password-reset.html',
      controller: 'PasswordResetCtrl',
      resolve: {
        $title: function() { return 'TITLES.PASSWORD_RESET'; }
      }
    })
    .state('reset-confirm', {
      url:'/reset/:key',
      templateUrl: 'views/password-reset.html',
      controller: 'PasswordResetCtrl',
      resolve: {
        $title: function() { return 'TITLES.PASSWORD_RESET'; }
      }
    })

    .state('projects', {
      abstract: true,
      url: '/projects',
      templateUrl: 'views/project-list-main.html',
      controller: 'ProjectListCtrl'
    })
    .state('projects.list', {
      url: '',
      templateUrl: 'views/project-list.html',
      resolve: {
        $title: function() { return 'TITLES.PROJECTS_LIST'; }
      },
      requireAuth: true
    })
    .state('projects.timeline', {
      url: '/timeline',
      templateUrl: 'views/project-timeline-list.html',
      resolve: {
        $title: function() { return 'TITLES.PROJECTS_TIMELINE_LIST'; }
      },
      requireAuth: true
    })

    .state('project', {
      url: '/project/:id',
      templateUrl: 'views/project-view.html',
      controller: 'ProjectViewCtrl',
      resolve: {
        // TODO get project title as page title?
        //$title: function() { return ''; }
      },
      requireAuth: true
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
        $title: function() { return 'TITLES.MANAGE_OVERVIEW'; }
      },
      requireAdmin: true
    })
    .state('manage.users', {
      url: '/users',
      templateUrl: 'views/manage-users.html',
      controller: 'ManageUsersCtrl',
      resolve: {
        $title: function() { return 'TITLES.MANAGE_USERS'; }
      },
      requireAdmin: true
    })
    .state('manage.projects', {
      url: '/projects',
      templateUrl: 'views/manage-projects.html',
      controller: 'ManageProjectsCtrl',
      resolve: {
        $title: function() { return 'TITLES.MANAGE_PROJECTS'; }
      },
      requireAdmin: true
    });

}).run(function($rootScope, $state, AuthService, SystemMessagesService, $window, $location, appConfig) {
  function ensureAuthenticated(event) {
    if ( !AuthService.isLoggedIn() ) {
      $state.transitionTo('login');
      event.preventDefault();
      SystemMessagesService.showWarning('You must be logged in to see that');
    }
  }

  function ensureAdmin(event) {
    if ( !AuthService.isAdminLoggedIn() ) {
      $state.transitionTo('projects.list');
      event.preventDefault();
      SystemMessagesService.showWarning('Administrator privileges required!');
    }
  }

  // Possible arguments: event, toState, toParams, fromState, fromParams
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if ( toState.requireAuth ) {
      ensureAuthenticated(event);
    }

    if ( toState.requireAdmin ) {
      ensureAuthenticated(event);
      ensureAdmin(event);
    }

    if ( toState.name === 'home' && AuthService.isLoggedIn() ) {
      $state.transitionTo('projects.list');
      event.preventDefault();
    }
  });

  if ( appConfig.gaTrackingId && $window.ga ) {
    $window.ga('create', appConfig.gaTrackingId, 'auto');
    //$window.ga('send', 'pageview');

    $rootScope.$on('$stateChangeSuccess', function() {
      $window.ga('send', 'pageview', $location.path());
    });
  }
});
