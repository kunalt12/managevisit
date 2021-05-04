/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.contactmanagements')
        .controller('ViewContactmanagementsCtrl', ViewContactmanagementsCtrl);

    /** @ngInject */
    function ViewContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $stateParams, OrganizationsFactory, Contactmanagement, $timeout, ngDialog, $config) {
        $scope.pageName = "Contact - View";
        $scope.btnName = "View";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.genderOption = [{
            label: "-",
            value: ""
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }];
        $scope.OrganizationOption = [{
            name: "-",
            id: null
        }];
        OrganizationsFactory.getRecords().success(function (t) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(t.data)
        }).error(function (e) {});
        $scope.showStatus = function (t) {
            var o = [];
            return t ? (void 0 === t.gender && null == t.gender && "" == t.gender || (o = $filter("filter")($scope.genderOption, {
                value: t.gender
            })), o.length ? o[0].label : "-") : "-"
        };
        $scope.organizationType = function (t) {
            var o = [];
            return t ? (void 0 === t.organization_id && null == t.organization_id && "" == t.organization_id || (o = $filter("filter")($scope.OrganizationOption, {
                id: t.organization_id
            })), o.length ? o[0].name : "-") : "-"
        }, Contactmanagement.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data
        }).error(function (e) {
            Notification.error(e.error), $state.go("roles.list")
        })
    }
})();