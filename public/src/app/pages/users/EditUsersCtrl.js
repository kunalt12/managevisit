/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('EditUsersCtrl', EditUsersCtrl);

    /** @ngInject */
    function EditUsersCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = "Edit User";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        UsersFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
        }).error(function (e) {
            Notification.error(e.error);
            $state.go("roles.list");
        });
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
        $scope.add_data = function (t) {
            $scope.isSubmitted = !0;
            p.validate(t).success(function () {
                $scope.formscope._method = "PUT";
                if (void 0 === $scope.formscope.dob || null === $scope.formscope.dob) {
                    $scope.formscope.dob = null;
                } else {
                    $scope.formscope.dob = moment($scope.formscope.dob).format("YYYY-MM-DD");
                    if ("Invalid date" == $scope.formscope.dob) {
                        return Notification.error("Please enter valid date."), $scope.formscope.dob = "", void($scope.isSubmitted = !1);
                    }
                    var t = (new moment).format("YYYY-MM-DD");
                    if ($scope.formscope.dob > t) return Notification.error("Please enter valid date."), void(e.isSubmitted = !1);
                };
                UsersFactory.updateRecord($scope.urlID, $scope.formscope).success(function (t) {
                    Notification.success(t.success);
                    $state.go("users.list");
                    $scope.isSubmitted = !1;
                }).error(function (t) {
                    Notification.error(t.error);
                    $scope.isSubmitted = !1;
                })
            }).error(function (t) {
                $scope.isSubmitted = !1;
            })
        }
    }
})();