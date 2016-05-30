'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageCtrl
 * @description
 * # ManageCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageCtrl', function ($rootScope, $scope, $state) {
    function getSelectedTabIndex(state) {
      var index = -1;

      switch(state.name) {
        case 'manage.overview':
          index = 0;
          break;
        case 'manage.users':
          index = 1;
          break;
        case 'manage.projects':
          index = 2;
          break;
      }

      return index;
    }

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var index = getSelectedTabIndex(toState);

      if ( index !== -1 ) {
        $scope.selectedTabIndex = index;
      }
    });

    var index = getSelectedTabIndex($state.current);
    if ( index !== -1 ) {
      $scope.selectedTabIndex = index;
    }
  });
