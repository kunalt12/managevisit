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
        $scope.pageName = "Add";
        $scope.action = "Add";
        $scope.role = {
            role_type: 3,
            is_editable: 1,
            permissions: {}
        };
        $scope.isSubmitted = !1;
        var m = $injector.get("$validation");
        RolesFactory.getAllPermission().success(function (t) {
            $scope.role.permissions = t
        }).error(function (e) {
            Notification.error(e.error), $state.go("roles.list")
        });
        $scope.roleMessage = RolesFactory.validation;
        $scope.submitRole = function (t) {
            $scope.isSubmitted = !0, m.validate(t).success(function () {
                RolesFactory.addRole($scope.role).success(function (t) {
                    Notification.success(t.success), $state.go("roles.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();