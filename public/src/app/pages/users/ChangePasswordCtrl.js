/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('ChangePasswordCtrl', ChangePasswordCtrl);

    /** @ngInject */
    function ChangePasswordCtrl($scope, fileReader, $filter, $timeout, $uibModal, $rootScope, $compile, $injector, $uibModalInstance, Notification, UsersFactory, user_id) {
        $scope.btnName = "Change";
        $scope.isSubmitted = !1;
        $scope.titleName = "Change Password";
        $scope.changepassformscope = {};
        var m = $injector.get("$validation");
        $scope.errorMessage = UsersFactory.validation;
        m.setExpression({
            confirmPassword: function (e, t, a, o) {
                return t.changepassformscope.new_password === t.changepassformscope.confirm_password;
            }
        }).setDefaultMsg({
            confirmPassword: {
                error: "Passwords do not match."
            }
        });
        $scope.change_password = function (t) {
            $scope.isSubmitted = !0;
            m.validate(t).success(function () {
                UsersFactory.changePassword(user_id, $scope.changepassformscope).success(function (t) {
                    Notification.success(t.success);
                    $scope.isSubmitted = !1;
                    $scope.changepassformscope = {};
                    $uibModalInstance.close($scope.changepassformscope);
                }).error(function (t) {
                    Notification.error(t.error);
                    $scope.isSubmitted = !1;
                })
            }).error(function () {
                $scope.isSubmitted = !1;
            })
        }
    }
})();