/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('SettingsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var SettingsFactory = {};

        SettingsFactory.validation = {
            admin_email: {required: "Admin email is required", invalidEmail: "Email is not valid", minlength : "Admin email is too short", maxlength : "Admin email is too long"},
            confirm_link_expired: {required: "Hours is required",minlength : "Hours is too short", maxlength : "Hours is too long"}
        };

        SettingsFactory.getAllSettings = function () {
            return $http.get($config.api_url + "settings");
        };

        SettingsFactory.updateRecord = function (id, data) {
            return $http.put($config.api_url + "settings/" + id, data);
        };

        return SettingsFactory;
    }]);
})();