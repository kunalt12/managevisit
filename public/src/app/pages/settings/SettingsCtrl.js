/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    /** @ngInject */
    function SettingsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, SettingsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Settings - Update";
        $scope.action = "Update";
        $scope.formscope = {};
        $scope.isSubmitted = !1;
        var m = $injector.get("$validation");
        SettingsFactory.getAllSettings().success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {});
        $scope.errorMessage = SettingsFactory.validation;
        $scope.updateSetting = function (t) {
            $scope.isSubmitted = !0, m.validate(t).success(function () {
                SettingsFactory.updateRecord($scope.formscope.id, $scope.formscope).success(function (t) {
                    Notification.success(t.success), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();