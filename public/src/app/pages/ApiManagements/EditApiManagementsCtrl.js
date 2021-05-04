/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ApiManagements')
        .controller('EditApiManagementsCtrl', EditApiManagementsCtrl);

    /** @ngInject */
    function EditApiManagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $timeout, $stateParams, $state, $injector, Notification, ApiManagementsFactory, UsersFactory) {
        $scope.pageName = "Edit API";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.statusOption = [{
            value: 2,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.managerOptions = [{
                name: "Please select tour manager",
                id: null
            }], UsersFactory.getTourManager().success(function (t) {
                $scope.managerOptions = $scope.managerOptions.concat(t.data), $.each($scope.managerOptions, function (t, a) {
                    void 0 != $scope.managerOptions[t].id && 1 == $scope.managerOptions[t].availability && ($scope.managerOptions[t].isDisabled = !0)
                })
            }).error(function (e) {}),
            $scope.errorMessage = ApiManagementsFactory.validation, ApiManagementsFactory.getRecord($scope.urlID).success(function (t) {
                $scope.formscope = t.data
            }).error(function (e) {
                Notification.error(e.error), $state.go("ApiManagements.list")
            }), $scope.changeKey = function () {
                $scope.formscope.api_key = $scope.randomString(16)
            }, $scope.add_data = function (t) {
                m.validate(t).success(function () {
                    $scope.isSubmitted = !0, $scope.formscope._method = "PUT", ApiManagementsFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
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
