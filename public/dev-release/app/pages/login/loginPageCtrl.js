/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.login')
        .controller('LoginPageCtrl', LoginPageCtrl);

    function LoginPageCtrl($scope, $state, fileReader, $filter, $uibModal, $rootScope, AuthenticationFactory, $timeout, $cookies, Notification) {
        $scope.formscope = { status: 1 };
        $scope.pageName = 'Login';
        $scope.btnName = 'Login';
        $scope.isSubmitted = false;
        $scope.admin = {};

        if ($cookies.email && $cookies.password) {
            $scope.admin.email = $cookies.email;
            $scope.admin.password = $cookies.password;
        }

        $scope.isFormSubmit = false;
        $scope.loginSubmit = function(valid) {
            $scope.submit = true;
            $scope.isFormSubmit = true;
            
            if (valid) {
                var data = { "email": $scope.admin.email, "password": $scope.admin.password };
                $scope.loginProgress = true;
                AuthenticationFactory.login(data).success(function(response) {
                    
                        if (response && response.result.token) {
                            // Setting a cookie if token available
                            Notification.success(response.result.message);
                            $cookies.put("token", response.result.token);

                            var auth_user = {};
                            auth_user = response.result.user;
                            //auth_user.company_slug = response.result.user.company_slug || 'super-admin';

                            $cookies.put("authUser", JSON.stringify(auth_user));

                            //Assign the current user permissions
                            $rootScope.permissions = response.result.permissions;
                            $rootScope.auth_user = response.result.user;
                            $rootScope.role = response.result.role;

                            if ($rootScope.auth_user.image) {
                                $rootScope.profilePicture = config.profile_url + auth_user.id + '/' + auth_user.image;
                            } else {
                                $rootScope.profilePicture = config.profile_url + '/noImage.png';
                            }

                            $state.go("dashboard");
                        } else {
                            Notification.error('These credentials do not match our records.');
                            $scope.loginProgress = false;
                        }
                        $scope.isFormSubmit = false;
                    })
                    .error(function(err) {
                        $scope.isFormSubmit = false;
                        var message = err.error ? err.error : 'Invalid login detail.';
                        Notification.error(message);
                        $scope.loginProgress = false;
                    });
            }
        };
    };
})();