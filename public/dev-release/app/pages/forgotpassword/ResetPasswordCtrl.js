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
        $scope.pageName = 'Settings - Update';
        $scope.action = "Change";
        $scope.formscope = {};
        $scope.isSubmitted = false;
        $scope.token = $stateParams.token;
        
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = AuthenticationFactory.validation;

        /* SET VALIDATION MESSAGE RULES*/
        var $validationProvider = $injector.get('$validation');
        $validationProvider.setExpression({
            confirmPassword: function(value, scope, element, attrs) {
                return scope.formscope.password === scope.formscope.confirm_password;
            }
        })
        .setDefaultMsg({
            confirmPassword: {
                error: 'Passwords do not match.'
            }
        });

        $scope.resetSubmit = function(form) {
            $scope.isSubmitted = true;
            
            $validationProvider.validate(form).success(function() {
                $scope.loginProgress = true;
                var data = {
                    email: $scope.formscope.email,
                    password: $scope.formscope.password,
                    password_confirmation: $scope.formscope.confirm_password,
                    token: $scope.token
                };
                
                AuthenticationFactory.resetPassword(data).success(function(response) {
                    Notification.success(response.success);
                    $scope.isSubmitted = false;
                    $scope.loginProgress = false;
                    $state.go('login');
                }).error(function(error) {
                    $scope.isSubmitted = false;
                    $scope.loginProgress = false;
                    Notification.error(error.error);
                });
            }).error(function() {
                $scope.loginProgress = false;                
                $scope.isSubmitted = false;
            });
        };
  }
})();