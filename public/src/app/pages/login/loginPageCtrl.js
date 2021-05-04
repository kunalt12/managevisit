/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('LoginPageCtrl', LoginPageCtrl);

    function LoginPageCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, AuthenticationFactory, $timeout, $cookies, Notification) {
        $scope.formscope = {
            status: 1
        };
        $scope.pageName = "Login";
        $scope.btnName = "Login";
        $scope.isSubmitted = !1;
        $scope.admin = {};
        if ($cookies.email && $cookies.password) {
            $scope.admin.email = $cookies.email;
            $scope.admin.password = $cookies.password;
        }
        $scope.isFormSubmit = !1;
        $scope.loginSubmit = function (a) {
            if ($scope.submit = !0, $scope.isFormSubmit = !0, a) {
                var o = {
                    email: $scope.admin.email,
                    password: $scope.admin.password
                };
                $scope.loginProgress = !0, AuthenticationFactory.login(o).success(function (a) {
                    if (a && a.result.token) {
                        Notification.success(a.result.message), $cookies.put("token", a.result.token);
                        var o = {};
                        o = a.result.user, $cookies.put("authUser", JSON.stringify(o)), $rootScope.permissions = a.result.permissions, $rootScope.auth_user = a.result.user, $rootScope.role = a.result.role, $rootScope.auth_user.image ? $rootScope.profilePicture = config.profile_url + o.id + "/" + o.image : $rootScope.profilePicture = config.profile_url + "/noImage.png", $state.go("dashboard")
                    } else Notification.error("These credentials do not match our records."), $scope.loginProgress = !1;
                    $scope.isFormSubmit = !1
                }).error(function (t) {
                    $scope.isFormSubmit = !1;
                    var a = t.error ? t.error : "Invalid login detail.";
                    Notification.error(a), $scope.loginProgress = !1
                })
            }
        }
    };
})();