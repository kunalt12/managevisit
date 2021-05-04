/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("AuthenticationFactory", ["$http", "$q", "$config", "$cookies", function ($http, $q, $config, $cookies) {
        var AuthenticationFactory = {};
        AuthenticationFactory.validation = {
            email: {
                required: "Email is required",
                invalidEmail: "Email is not valid",
                minlength: "Email is too short",
                maxlength: "Email is too long"
            },
            password: {
                required: "Password is required",
                minlength: "Password is too short",
                maxlength: "Password is too long"
            },
            confirm_password: {
                required: "Confirm password is required"
            }
        };
        AuthenticationFactory.login = function (t) {
            return $http.post($config.api_url + "login", t);
        };
        AuthenticationFactory.logout = function (t) {
            var o = objectToFormData(t);
            return $http.post($config.api_url + "logout", o, {
                headers: {
                    "Content-Type": void 0
                }
            });
        };
        AuthenticationFactory.forgotPassword = function (t) {
            return $http.post($config.api_url + "password/email", t);
        };
        AuthenticationFactory.resetPassword = function (t) {
            return $http.post($config.api_url + "password/reset", t);
        };
        AuthenticationFactory.refreshToken = function () {
            return $http.post($config.api_url + "refresh-token", {}, {
                headers: {
                    Authorization: $cookies.get("token")
                }
            });
        };
        AuthenticationFactory.checkPermission = function (t) {
            return $http.post($config.api_url + "check-permission", {
                permission: t
            });
        };
        AuthenticationFactory.checkLogin = function () {
            return $http.get($config.api_url + "check-for-login");
        };
        return AuthenticationFactory;
    }]);
})();