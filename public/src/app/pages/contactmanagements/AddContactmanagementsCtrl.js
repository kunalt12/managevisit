/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.contactmanagements')
        .controller('AddContactmanagementsCtrl', AddContactmanagementsCtrl);

    /** @ngInject */
    function AddContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, VisitorsFactory, OrganizationsFactory, Contactmanagement, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Add Contact Management";
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.formscope = {
            gender: null,
            organization_id: null,
            visitor_type: null,
            country_id: null,
            status: 1
        };
        $scope.formscope.country_code = "1";
        $scope.formscope.phone_number_country_code = "1";
        $scope.statusOption = [{
            value: 2,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        $scope.genderOption = [{
            label: "Please select gender",
            value: null
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }];
        $scope.OrganizationOption = [{
            name: "Please select organization type",
            id: null
        }];
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }], OrganizationsFactory.getRecords().success(function (t) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(t.data)
        }).error(function (e) { }), VisitorsFactory.getRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data)
        }).error(function (e) { });
        $scope.countries = [{
            id: null,
            country_name: "Please select country"
        }], UsersFactory.getCountry().success(function (t) {
            $scope.countries = $scope.countries.concat(t)
        }).error(function (e) { });
        $scope.errorMessage = Contactmanagement.validation;
        var f = $injector.get("$validation");
        $scope.add_data = function (t) {
            f.validate(t).success(function () {
                $scope.formscope.mobile = $scope.formscope.country_code + "-" + $scope.formscope.mobile;
                $scope.formscope.phone_number = $scope.formscope.phone_number_country_code + "-" + $scope.formscope.phone_number;
                $scope.isSubmitted = !0;
                Contactmanagement.addRecord($scope.formscope).success(function (t) {
                    Notification.success(t.success), $state.go("contactmanagements.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();