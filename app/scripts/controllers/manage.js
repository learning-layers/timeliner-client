'use strict';

/**
 * @ngdoc function
 * @name timelinerApp.controller:ManageCtrl
 * @description
 * # ManageCtrl
 * Controller of the timelinerApp
 */
angular.module('timelinerApp')
  .controller('ManageCtrl', function ($scope, $state) {
    $scope.doManage = function(section) {
      $state.go('manage.' + section);
    };
  });
