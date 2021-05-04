/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.ApiManagements')
        .controller('AddApiManagementsCtrl', AddApiManagementsCtrl);

    /** @ngInject */
    function AddApiManagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, ApiManagementsFactory, $timeout, $stateParams, $state, $injector, Notification, $q) {
        $scope.pageName = 'Add API';
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;

        $scope.errorMessage = ApiManagementsFactory.validation;
        var $validationProvider = $injector.get('$validation');

        $scope.formscope = { status: 1 };
        $scope.formscope.api_key = $scope.randomString(16);

        $scope.statusOption = [
            { 'value': 2, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        $scope.changeKey = function() {
            $scope.formscope.api_key = $scope.randomString(16);
        };

        $scope.add_data = function(form) {
            var data = $scope.formscope.slug;
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                ApiManagementsFactory.addRecord($scope.formscope).success(function(res) {
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