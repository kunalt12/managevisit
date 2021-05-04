/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.forgotpassword')
        .controller('ResetPasswordCtrl', ResetPasswordCtrl);

    /** @ngInject */
    function ResetPasswordCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, AuthenticationFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Settings - Update";
        $scope.action = "Change";
        $scope.formscope = {};
        $scope.isSubmitted = !1;
        $scope.token = $stateParams.token;
        $scope.errorMessage = AuthenticationFactory.validation;
        var m = $injector.get("$validation");
        m.setExpression({
            confirmPassword: function (e, t, a, o) {
                return t.formscope.password === t.formscope.confirm_password
            }
        }).setDefaultMsg({
            confirmPassword: {
                error: "Passwords do not match."
            }
        });
        $scope.resetSubmit = function (t) {
            $scope.isSubmitted = !0, m.validate(t).success(function () {
                $scope.loginProgress = !0;
                var t = {
                    email: $scope.formscope.email,
                    password: $scope.formscope.password,
                    password_confirmation: $scope.formscope.confirm_password,
                    token: $scope.token
                };
                AuthenticationFactory.resetPassword(t).success(function (t) {
                    Notification.success(t.success), $scope.isSubmitted = !1, $scope.loginProgress = !1, $state.go("login")
                }).error(function (t) {
                    $scope.isSubmitted = !1, $scope.loginProgress = !1, Notification.error(t.error)
                })
            }).error(function () {
                $scope.loginProgress = !1, $scope.isSubmitted = !1
            })
        }
    }
})();