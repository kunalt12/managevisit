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
        $scope.pageName = "Add";
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.formscope = {
            gender: null,
            organization_id: null,
            visitor_type: null,
            status: 1
        };
        $scope.statusOption = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.errorMessage = DefaulttasksFactory.validation;
        $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, DefaulttasksFactory.addRecord($scope.formscope).success(function (t) {
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