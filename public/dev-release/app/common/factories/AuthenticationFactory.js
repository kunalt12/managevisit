/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
  angular.module('BlurAdmin').factory('AuthenticationFactory', ['$http', '$q', '$config', '$cookies', function($http, $q, $config, $cookies) {
        var AuthenticationFactory = {};

        AuthenticationFactory.validation = {
            email: { required: "Email is required", invalidEmail: "Email is not valid", minlength: "Email is too short", maxlength: "Email is too long" },
            password: { required: "Password is required", minlength: "Password is too short", maxlength: "Password is too long" },
            confirm_password: { required: "Confirm password is required" },
        };

        /**
         * Login
         */
        AuthenticationFactory.login = function(data) {
            // var formData = objectToFormData(data);
            // return $http.post($config.api_url + "login", formData, { headers: {'Content-Type': undefined }});
            return $http.post($config.api_url + "login", data);
        };

        /**
         * Invalid the token
         */
        AuthenticationFactory.logout = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "logout", formData, { headers: {'Content-Type': undefined }});
            // return $http.post($config.api_url + "logout", data);
        };

        /*
        * Forgot Password
        */
        AuthenticationFactory.forgotPassword = function(data) {
            return $http.post($config.api_url + "password/email", data);
        };

        /*
        * Reset Password
        */
        AuthenticationFactory.resetPassword = function(data) {
            return $http.post($config.api_url + "password/reset", data);
        };

        /**
         * Refresh Token 
         */
        AuthenticationFactory.refreshToken = function() {
            return $http.post($config.api_url + "refresh-token", {}, {
                headers: {
                    Authorization: $cookies.get("token")
                }
            });
        };

        /**
         * Check Permission of Current User
         */
        AuthenticationFactory.checkPermission = function(permission) {
            // var pp = { permission: permission };
            // var formData = objectToFormData(pp);
            // return $http.post($config.api_url + "check-permission", formData, { headers: {'Content-Type': undefined }});
            // return $http.post($config.api_url + "check-permission", { permission: objectToFormData(permission) }, { headers: {'Content-Type': undefined }});
            return $http.post($config.api_url + "check-permission", { permission: permission });
        }

        AuthenticationFactory.checkLogin = function(){
            return $http.get($config.api_url + "check-for-login");
        }

        return AuthenticationFactory;
    }]);
})();