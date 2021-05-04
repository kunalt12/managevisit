/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.ApiManagements')
        .controller('AddApiManagementsCtrl', AddApiManagementsCtrl);

    /** @ngInject */
    function AddApiManagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, ApiManagementsFactory, $timeout, $stateParams, $state, $injector, Notification, $q) {
        $scope.pageName = "Add API", $scope.btnName = "Add", $scope.isSubmitted = !1, $scope.errorMessage = ApiManagementsFactory.validation;
        var p = $injector.get("$validation");
        $scope.formscope = {
            status: 1
        }, $scope.managerOptions = [{
            name: "Please select tour manager",
            id: null
        }], UsersFactory.getTourManager().success(function (t) {
            $scope.managerOptions = $scope.managerOptions.concat(t.data), $.each($scope.managerOptions, function (t, a) {
                void 0 != $scope.managerOptions[t].id && 1 == $scope.managerOptions[t].availability && ($scope.managerOptions[t].isDisabled = !0)
            })
        }).error(function (e) {}), $scope.formscope.api_key = $scope.randomString(16), $scope.statusOption = [{
            value: 2,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }], $scope.changeKey = function () {
            $scope.formscope.api_key = $scope.randomString(16)
        }, $scope.add_data = function (t) {
            $scope.formscope.slug;
            p.validate(t).success(function () {
                $scope.isSubmitted = !0, ApiManagementsFactory.addRecord($scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("ApiManagements.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();