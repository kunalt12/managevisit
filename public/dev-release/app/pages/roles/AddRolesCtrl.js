/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.roles')
    .controller('AddRolesCtrl', AddRolesCtrl);

  /** @ngInject */
  function AddRolesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, RolesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Add';
        $scope.action = "Add";
        $scope.role = {
            role_type: 3,
            is_editable: 1,
            permissions: {}
        };
        $scope.isSubmitted = false;

        var $validationProvider = $injector.get('$validation');

        /* GET PERMISSIONS */
        RolesFactory.getAllPermission().success(function (response) {
            $scope.role.permissions = response;
            // console.log($scope.role.permissions);
        }).error(function (error) {
            Notification.error(error.error);
            $state.go('roles.list');
        });
        /* SET VALIDATION MESSAGE RULES*/
        
        $scope.roleMessage = RolesFactory.validation;
        /* ADD ROLES */

        $scope.submitRole = function (form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form)
                .success(function () {                    
                    RolesFactory.addRole($scope.role).success(function (response) {
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
