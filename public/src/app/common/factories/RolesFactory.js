/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("RolesFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var RolesFactory = {};
        RolesFactory.validation = {
            name: {
                required: "Role name is required",
                minlength: "Role name is too short",
                maxlength: "Role name is too long"
            },
            description: {
                required: "Role description is required",
                minlength: "Role description is too short",
                maxlength: "Role description is too long"
            }
        };
        RolesFactory.getAllRole = function () {
            return $http.get($config.api_url + "roles");
        };
        RolesFactory.getRole = function (t) {
            return $http.get($config.api_url + "roles/" + t + "/edit");
        };
        RolesFactory.getRolePermisssions = function (t) {
            return $http.post($config.api_url + "get-role-permission", {
                id: t
            });
        };
        RolesFactory.addRole = function (t) {
            return $http.post($config.api_url + "roles", t);
        };
        RolesFactory.updateRole = function (t, o) {
            return $http.put($config.api_url + "roles/" + t, o);
        };
        RolesFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "roles/get-roles-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        RolesFactory.changeUserRole = function (t) {
            return $http.post($config.api_url + "roles/change-user-role", t);
        };
        RolesFactory.roleList = function (t) {
            return $http.post($config.api_url + "roles/role-list", t);
        };
        RolesFactory.getAllPermission = function () {
            return $http.post($config.api_url + "permission/get-permissions");
        };
        RolesFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "roles/" + t);
        };
        return RolesFactory;
    }]);
})();