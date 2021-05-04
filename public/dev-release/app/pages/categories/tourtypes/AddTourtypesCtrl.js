/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.categories.tourtypes')
    .controller('AddTourtypesCtrl', AddTourtypesCtrl);

  /** @ngInject */
  function AddTourtypesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, TourtypesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.formscope = {status:1};
        $scope.pageName = 'Add Tour Type';
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;
        
        $scope.statusData = [
            { 'value': 0, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = TourtypesFactory.validation;

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                
                TourtypesFactory.addRecord($scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('categories.tourtypes.list');
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
