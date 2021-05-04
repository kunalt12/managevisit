/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("OrganizationsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var OrganizationsFactory = {};
        OrganizationsFactory.validation = {
            name: {
                required: "Name is required",
                minlength: "Name is too short",
                maxlength: "Name is too long"
            },
            description: {
                required: "Description is required"
            },
            status: {
                required: "Please select status"
            }
        };
        OrganizationsFactory.addRecord = function (t) {
            return $http.post($config.api_url + "organizations", t);
        };
        OrganizationsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "organizations/" + t + "/edit");
        };
        OrganizationsFactory.getRecords = function () {
            return $http.get($config.api_url + "organizations");
        };
        OrganizationsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "organizations/getalldata");
        };
        OrganizationsFactory.updateRecord = function (t, o) {
            return $http.post($config.api_url + "organizations/" + t, o);
        };
        OrganizationsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "organizations/get-organizations-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        OrganizationsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "organizations/" + t);
        };
        return OrganizationsFactory;
    }]);
})();