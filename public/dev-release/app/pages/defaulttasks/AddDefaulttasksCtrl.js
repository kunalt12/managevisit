/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.defaulttasks')
    .controller('AddDefaulttasksCtrl', AddDefaulttasksCtrl);

  /** @ngInject */
  function AddDefaulttasksCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, DefaulttasksFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Add';
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;
        $scope.formscope = {gender: null, organization_id:null, visitor_type:null, status:1};
        
        $scope.statusOption = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = DefaulttasksFactory.validation;

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                
                DefaulttasksFactory.addRecord($scope.formscope).success(function(res) {
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


