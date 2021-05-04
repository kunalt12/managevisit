/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('ChangePasswordCtrl', ChangePasswordCtrl);

    /** @ngInject */
    function ChangePasswordCtrl($scope, fileReader, $filter, $timeout, $uibModal, $rootScope, $compile, $injector, $uibModalInstance, Notification, UsersFactory, user_id) {
        $scope.btnName = 'Change';
        $scope.isSubmitted = false;
        $scope.titleName = 'Change Password';

        $scope.changepassformscope = {};

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = UsersFactory.validation;

        var $validationProvider = $injector.get('$validation');
        $validationProvider.setExpression({
                confirmPassword: function(value, scope, element, attrs) {
                    return scope.changepassformscope.new_password === scope.changepassformscope.confirm_password;
                }
            })
            .setDefaultMsg({
                confirmPassword: {
                    error: 'Passwords do not match.'
                }
            });

        $scope.change_password = function(form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form).success(function() {
                UsersFactory.changePassword(user_id, $scope.changepassformscope).success(function(response) {
                    Notification.success(response.success);
                    $scope.isSubmitted = false;
                    $scope.changepassformscope = {};
                    $uibModalInstance.close($scope.changepassformscope);
                }).error(function(error) {
                    Notification.error(error.error);
                    $scope.isSubmitted = false;
                });
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
    }
})();