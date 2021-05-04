/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("TransportsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var TransportsFactory = {};
        TransportsFactory.validation = {
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
        TransportsFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "transports", t);
        };
        TransportsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "transports/" + t + "/edit");
        };
        TransportsFactory.getRecords = function () {
            return $http.get($config.api_url + "transports");
        };
        TransportsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "transports/getalldata");
        };
        TransportsFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "transports/" + t, o);
        };
        TransportsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "transports/get-transports-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        TransportsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "transports/" + t);
        };
        return TransportsFactory;
    }]);
})();