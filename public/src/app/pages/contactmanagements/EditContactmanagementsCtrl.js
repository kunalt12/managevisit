/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.contactmanagements')
        .controller('EditContactmanagementsCtrl', EditContactmanagementsCtrl);

    /** @ngInject */
    function EditContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, VisitorsFactory, OrganizationsFactory, Contactmanagement, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Edit Contact Management";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.formscope = {
            country_code: "1",
            phone_number_country_code: "1"
        }
        $scope.statusOption = [{
            value: 2,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        $scope.genderOption = [{
            label: "Please select gender",
            value: ""
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
        var f = $injector.get("$validation");
        $scope.errorMessage = Contactmanagement.validation, Contactmanagement.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
            var mobileString;
            if ($scope.formscope.mobile && $scope.formscope.mobile.indexOf('-') > -1) {
                mobileString = $scope.formscope.mobile.split('-');
                $scope.formscope.country_code = mobileString[0];
                $scope.formscope.mobile = mobileString[1];
            } else {
                $scope.formscope.country_code = "1";
            }
            var phoneNumberString;
            if ($scope.formscope.phone_number && $scope.formscope.phone_number.indexOf('-') > -1) {
                phoneNumberString = $scope.formscope.phone_number.split('-');
                $scope.formscope.phone_number_country_code = phoneNumberString[0];
                $scope.formscope.phone_number = phoneNumberString[1];
            } else {
                $scope.formscope.phone_number_country_code = "1";
            }
            $scope.formscope.country_code = visitorInfo.country_code;
            $scope.formscope.mobile = visitorInfo.mobile;
            $scope.formscope.phone_number = visitorInfo.phone_number;
            $scope.formscope.phone_number_country_code = visitorInfo.phone_number_country_code;
        }).error(function (e) {
            Notification.error(e.error), $state.go("contactmanagements.list")
        });
        $scope.add_data = function (t) {
            f.validate(t).success(function () {
                $scope.formscope.mobile = $scope.formscope.country_code + "-" + $scope.formscope.mobile;
                $scope.formscope.phone_number = $scope.formscope.phone_number_country_code + "-" + $scope.formscope.phone_number;
                $scope.isSubmitted = !0;
                $scope.formscope._method = "PUT";
                Contactmanagement.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
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