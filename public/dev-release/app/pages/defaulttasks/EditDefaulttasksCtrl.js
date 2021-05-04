/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.defaulttasks')
    .controller('EditDefaulttasksCtrl', EditDefaulttasksCtrl);

  /** @ngInject */
  function EditDefaulttasksCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DefaulttasksFactory, Contactmanagement, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Edit';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.statusOption = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];
   
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = DefaulttasksFactory.validation;

        DefaulttasksFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('defaulttasks.list');
        });

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                $scope.formscope._method = 'PUT';
                
                DefaulttasksFactory.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('defaulttasks.list');
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
