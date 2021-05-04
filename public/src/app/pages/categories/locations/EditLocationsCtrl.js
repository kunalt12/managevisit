/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.locations')
        .controller('EditLocationsCtrl', EditLocationsCtrl);

    /** @ngInject */
    function EditLocationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, LocationsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Edit Info Session";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = l.id;
        $scope.statusData = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.errorMessage = LocationsFactory.validation, LocationsFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("categories.locations.list")
        }), $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, $scope.formscope._method = "PUT", LocationsFactory.updateRecord(e.urlID, $scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("categories.locations.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();