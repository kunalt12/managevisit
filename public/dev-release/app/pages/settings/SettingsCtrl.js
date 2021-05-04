/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.settings')
    .controller('SettingsCtrl', SettingsCtrl);

  /** @ngInject */
  function SettingsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, SettingsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Settings - Update';
        $scope.action = "Update";
        $scope.formscope = {};
        $scope.isSubmitted = false;

        var $validationProvider = $injector.get('$validation');
        SettingsFactory.getAllSettings().success(function (response) {
            $scope.formscope = response.data;
        }).error(function (error) {

        });

        /* SET VALIDATION MESSAGE RULES*/
        $scope.errorMessage = SettingsFactory.validation;
        
        $scope.updateSetting = function (form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form).success(function () {
                SettingsFactory.updateRecord($scope.formscope.id, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $scope.isSubmitted = false;
                }).error(function(err) {
                    Notification.error(err.error);
                    $scope.isSubmitted = false;
                });
            })
            .error(function () {
                $scope.isSubmitted = false;
            });
        };
  }
})();
