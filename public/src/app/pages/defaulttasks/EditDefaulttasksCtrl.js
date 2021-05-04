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
        $scope.pageName = "Edit";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.statusOption = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var p = $injector.get("$validation");
        $scope.errorMessage = DefaulttasksFactory.validation, DefaulttasksFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("defaulttasks.list")
        });
        $scope.add_data = function (t) {
            p.validate(t).success(function () {
                $scope.isSubmitted = !0, $scope.formscope._method = "PUT", DefaulttasksFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("defaulttasks.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();