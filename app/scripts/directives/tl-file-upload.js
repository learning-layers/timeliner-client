'use strict';

/**
 * @ngdoc directive
 * @name timelinerApp.directive:tlFileUpload
 * @description
 * # tlFileUpload
 */
angular.module('timelinerApp')
  .directive('tlFileUpload', function ($mdUtil, appConfig, ProjectsService) {
    var template = '<div layout="row" layout-align="space-between start">' +
      '<div class="tl-file-input-row-content">' +
        '<input aria-label="file" ng-disabled="isDisabled()" type="file" ng-hide="true">' +
        '<md-icon md-font-set="mdi" md-font-icon="{{ getIcon() }}" class="tl-file-icon" ng-if="value"></md-icon>' +
        '<span class="tl-file-name">{{ getFileName() }}</span>' +
      '</div>' +
      '<div class="tl-file-input-row-content">' +
        '<md-button class="md-icon-button" aria-label="Remove file" type="button" ng-click="removeFileForUpload($event)" ng-show="hasFile()" ng-disabled="isDisabled()"><md-icon>delete</md-icon></md-button>' +
        '<md-button class="md-icon-button" aria-label="Select file for upload" type="button" ng-click="selectFileForUpload($event)" ng-disabled="isDisabled()"><md-icon>file_upload</md-icon></md-button>' +
      '</div>' +
    '</div>';

    return {
      restrict: 'E',
      require: ['^?mdInputContainer', '?ngModel', '?^form'],
      template: template,
      scope: {
        value: '=ngModel'
      },
      link: function postLink(scope, element, attrs, ctrls) {
        var containerCtrl = ctrls[0];
        var ngModelCtrl = ctrls[1] || $mdUtil.fakeNgModel();
        var parentForm = ctrls[2];
        var fileElement = element.find('input[type="file"]')[0];


        var errorsSpacer = angular.element('<div class="md-errors-spacer">');
        element.after(errorsSpacer);

        ngModelCtrl.$validators.size = function(modelValue, viewValue) {
          if ( ngModelCtrl.$isEmpty(modelValue) ) {
            // consider empty models to be valid
            return true;
          }

          if ( viewValue.size <= appConfig.uploadFileSizeLimit ) {
            return true;
          }

          // it is invalid
          return false;
        };

        scope.isDisabled = function() {
          return attrs.disabled;
        };

        scope.selectFileForUpload = function(ev) {
            fileElement.click();
            angular.element(ev.target).parent().blur();
        };

        scope.hasFile = function() {
          return !!scope.value;
        };

        scope.removeFileForUpload = function() {
          if ( scope.hasFile() ) {
            scope.value = null;
            fileElement.value = null;
            ngModelCtrl.$setPristine();
            ngModelCtrl.$setUntouched();
          }
        };

        scope.getFileName = function() {
          if ( scope.value && scope.value.name ) {
            return scope.value.name;
          }

          return '';
        };

        scope.getIcon = function() {
          return ProjectsService.getFileIcon(scope.value);
        };

        element.addClass('md-input');

        element.on('change', function() {
          if ( fileElement.files.length > 0 ) {
            scope.value = fileElement.files[0];
            scope.$apply();
          }
        });

        element.on('click', function() {
          ngModelCtrl.$setDirty();
          ngModelCtrl.$setTouched();
        });

        var isErrorGetter = function() {
          return ngModelCtrl.$invalid && (ngModelCtrl.$touched || (parentForm && parentForm.$submitted));
        };

        scope.$watch(isErrorGetter, containerCtrl.setInvalid);

        scope.$on('$destroy', function() {
          containerCtrl.setFocused(false);
          containerCtrl.setHasValue(false);
          element.off('change');
          element.off('click');
        });
      }
    };
  });
