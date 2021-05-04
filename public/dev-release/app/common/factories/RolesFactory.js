/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('RolesFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var RolesFactory = {};

    RolesFactory.validation = {
            name: {required: "Role name is required", minlength : "Role name is too short", maxlength : "Role name is too long"},
            description: {required: "Role description is required",minlength : "Role description is too short", maxlength : "Role description is too long"}
        };

        RolesFactory.getAllRole = function () {
            return $http.get($config.api_url + "roles");
        };

        RolesFactory.getRole = function (role_id) {
            return $http.get($config.api_url + "roles/" + role_id + "/edit");
        };

        RolesFactory.getRolePermisssions = function (id) {
            return $http.post($config.api_url + "get-role-permission", {id: id});
        };

        RolesFactory.addRole = function (data) {
            return $http.post($config.api_url + "roles", data);
        };

        RolesFactory.updateRole = function (id, data) {
            return $http.put($config.api_url + "roles/" + id, data);
        };

        RolesFactory.showDataTable = function (data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'roles/get-roles-list',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        };

        RolesFactory.changeUserRole = function(data) {
            return $http.post($config.api_url + "roles/change-user-role", data);
        };

        RolesFactory.roleList = function(data) {
            return $http.post($config.api_url + "roles/role-list", data);
        };

        RolesFactory.getAllPermission = function() {
            return $http.post($config.api_url + "permission/get-permissions");
        };

        RolesFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "roles/"+data);
        };
        return RolesFactory;
}]);
})();