/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("LocationsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var LocationsFactory = {};
        LocationsFactory.validation = {
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
        LocationsFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "locations", t);
        };
        LocationsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "locations/" + t + "/edit");
        };
        LocationsFactory.getRecords = function () {
            return $http.get($config.api_url + "locations");
        };
        LocationsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "locations/getalldata");
        };
        LocationsFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "locations/" + t, o);
        };
        LocationsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "locations/get-locations-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        LocationsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "locations/" + t);
        };
        return LocationsFactory;
    }]);
})();