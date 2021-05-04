/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.transports')
    .controller('EditTransportsCtrl', EditTransportsCtrl);

  /** @ngInject */
  function EditTransportsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, TransportsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Edit Transport type';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.statusData = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];
   
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = TransportsFactory.validation;

        TransportsFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('categories.transports.list');
        });

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                $scope.formscope._method = 'PUT';
                
                TransportsFactory.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('categories.transports.list');
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
