/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.ApiManagements')
    .controller('EditApiManagementsCtrl', EditApiManagementsCtrl);

  /** @ngInject */
  function EditApiManagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $timeout, $stateParams, $state, $injector, Notification, ApiManagementsFactory) {
        $scope.pageName = 'Edit API';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.statusOption = [
            { 'value': 2, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        var $validationProvider = $injector.get('$validation');
         $scope.errorMessage = ApiManagementsFactory.validation;

        ApiManagementsFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('ApiManagements.list');
        });

        $scope.changeKey = function() {
            $scope.formscope.api_key = $scope.randomString(16);
        };

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                $scope.formscope._method = 'PUT';
                
                ApiManagementsFactory.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('ApiManagements.list');
                    $scope.isSubmitted = false;
                }).error(function(err) {
                    Notification.error(err.error);
                    $scope.isSubmitted = false;
                });
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
  }
})();
