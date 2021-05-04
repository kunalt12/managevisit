/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.roles')
    .controller('EditRolesCtrl', EditRolesCtrl);

  /** @ngInject */
  function EditRolesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, RolesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Edit';
        $scope.action = 'Update';
       
        $scope.roleId = $stateParams.id;
        $scope.role = {};
        $scope.isSubmitted = false;

        var $validationProvider = $injector.get('$validation');

        RolesFactory.getRole($scope.roleId).success(function (response) {
            $scope.role = response.data;
        }).error(function (error) {
                Notification.error(error.error);
                $state.go('roles.list');
        });

        $scope.roleMessage = RolesFactory.validation;

        $scope.submitRole = function (form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form)
                .success(function () {
                    RolesFactory.updateRole($scope.role.id, $scope.role).success(function (response) {
                        Notification.success(response.success);
                        $state.go('roles.list');
                        $scope.isSubmitted = false;
                    }).error(function (error) {
                        Notification.error(error.error);
                        $scope.isSubmitted = false;
                        
                    });
                })
                .error(function () {
                    $scope.isSubmitted = false;
                });
        };
  }
})();
