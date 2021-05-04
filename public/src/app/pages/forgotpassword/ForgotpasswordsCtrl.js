/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.forgotpassword')
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl);

    /** @ngInject */
    function ForgotPasswordCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, AuthenticationFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Settings - Update";
        $scope.action = "Send";
        $scope.formscope = {};
        $scope.isSubmitted = !1;
        $scope.error = "";
        var m = $injector.get("$validation");
        $scope.errorMessage = AuthenticationFactory.validation;
        $scope.forgotSubmit = function (t) {
            $scope.isSubmitted = !0, m.validate(t).success(function () {
                $scope.loginProgress = !0;
                var t = {
                    email: $scope.formscope.email
                };
                AuthenticationFactory.forgotPassword(t).success(function (t) {
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