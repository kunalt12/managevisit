/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.affiliations')
        .controller('EditAffiliationsCtrl', EditAffiliationsCtrl);

    /** @ngInject */
    function EditAffiliationsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, AffiliationsFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Edit Affiliations";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.statusData = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        var m = $injector.get("$validation");
        $scope.errorMessage = AffiliationsFactory.validation, AffiliationsFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("categories.affiliations.list")
        }), $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, $scope.formscope._method = "PUT", AffiliationsFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("categories.affiliations.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();