/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.locations')
    .controller('EditLocationsCtrl', EditLocationsCtrl);

  /** @ngInject */
  function EditLocationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, LocationsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Edit Info Session';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.statusData = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];
   
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = LocationsFactory.validation;

        LocationsFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('categories.locations.list');
        });

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                $scope.formscope._method = 'PUT';
                
                LocationsFactory.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('categories.locations.list');
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
