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
        $scope.pageName = 'Settings - Update';
        $scope.action = "Send";
        $scope.formscope = {};
        $scope.isSubmitted = false;
        $scope.error = "";
        
        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = AuthenticationFactory.validation;

        $scope.forgotSubmit = function(form) {
            $scope.isSubmitted = true;
            
            $validationProvider.validate(form).success(function() {
                $scope.loginProgress = true;
                var data = { "email": $scope.formscope.email};
                
                AuthenticationFactory.forgotPassword(data).success(function(response) {
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