/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('AddUsersCtrl', AddUsersCtrl);

    /** @ngInject */
    function AddUsersCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = "Add User";
        $scope.btnName = "Add";
        $scope.formscope = {
            gender: null,
            user_type: null,
            country_id: null,
            status: 1,
            first_name: "",
            middle_name: "",
            last_name: "",
            dob: "",
            phone_number: "",
            mobile: "",
            address: "",
            address1: "",
            state: "",
            city: "",
            zip_code: ""
        };
        $scope.isSubmitted = !1;
        $scope.loginProgress = !1;
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
        $scope.statusOption = [{
            label: "Please select status",
            value: null
        }, {
            label: "Active",
            value: 1
        }, {
            label: "Inactive",
            value: 2
        }];
        $scope.userTypeOption = [{
            id: null,
            name: "Please select user type"
        }];
        RolesFactory.roleList().success(function (t) {
            $scope.userTypeOption = $scope.userTypeOption.concat(t.data);
        }).error(function (e) {});
        $scope.countries = [{
            id: null,
            country_name: "Please select country"
        }];
        UsersFactory.getCountry().success(function (t) {
            $scope.countries = $scope.countries.concat(t);
        }).error(function (e) {});
        $scope.errorMessage = UsersFactory.validation;
        var p = $injector.get("$validation");
        p.setExpression({
            confirmPassword: function (e, t, a, o) {
                return t.formscope.password === t.formscope.confirm_password;
            }
        }).setDefaultMsg({
            confirmPassword: {
                error: "Passwords do not match."
            }
        });
        $scope.mailModal = function (t) {
            p.validate(t).success(function () {
                $uibModal.open({
                    animation: !0,
                    backdrop: "static",
                    controller: "UserMailModalCtrl",
                    templateUrl: "app/pages/users/mailModal.html",
                    resolve: {}
                }).result.then(function (t) {
                    $scope.add_data(t)
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        };
        $scope.add_data = function (t) {
            $scope.isSubmitted = !0;
            $scope.loginProgress = !0;
            $scope.formscope.password = $rootScope.makeid(8);
            if ($scope.formscope.dob) {
                $scope.formscope.dob = moment($scope.formscope.dob).format("YYYY-MM-DD");
                if ("Invalid date" == $scope.formscope.dob) {
                    return Notification.error("Please enter valid date.");
                }
                $scope.formscope.dob = "";
                $scope.loginProgress = !1, void($scope.isSubmitted = !1);
                var a = (new moment).format("YYYY-MM-DD");
                if ($scope.formscope.dob > a) {
                    return Notification.error("Please enter valid date.");
                }
                $scope.loginProgress = !1, void($scope.isSubmitted = !1);
            }
            $scope.formscope.sendMail = t.sendMail;
            $scope.formscope.mailSubject = t.mailSubject;
            $scope.formscope.mailContent = t.mailContent, UsersFactory.addRecord($scope.formscope).success(function (t) {
                Notification.success(t.success);
                $state.go("users.list");
                $scope.isSubmitted = !1;
            }).error(function (t) {
                $scope.loginProgress = !1;
                Notification.error(t.error);
                $scope.isSubmitted = !1;
            })
        }
    }
})();