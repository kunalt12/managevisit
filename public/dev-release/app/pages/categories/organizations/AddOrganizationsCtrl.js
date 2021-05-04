/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.organizations')
    .controller('AddOrganizationsCtrl', AddOrganizationsCtrl);

  /** @ngInject */
  function AddOrganizationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, OrganizationsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.formscope = {status:1};
        $scope.pageName = 'Add Organization Type';
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;
        
        $scope.statusData = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = OrganizationsFactory.validation;

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                
                OrganizationsFactory.addRecord($scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('categories.organizations.list');
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


