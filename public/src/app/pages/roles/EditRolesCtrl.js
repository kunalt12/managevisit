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
        $scope.pageName = "Edit";
        $scope.action = "Update";
        $scope.roleId = $stateParams.id;
        $scope.role = {};
        $scope.isSubmitted = !1;
        var m = $injector.get("$validation");
        RolesFactory.getRole($scope.roleId).success(function (t) {
            $scope.role = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("roles.list")
        });
        $scope.roleMessage = RolesFactory.validation;
        $scope.submitRole = function (t) {
            $scope.isSubmitted = !0, m.validate(t).success(function () {
                RolesFactory.updateRole($scope.role.id, $scope.role).success(function (t) {
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