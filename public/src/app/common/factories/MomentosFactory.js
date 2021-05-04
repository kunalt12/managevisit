/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("MomentosFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var MomentosFactory = {};
        MomentosFactory.validation = {
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
        MomentosFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "momento", t);
        };
        MomentosFactory.getRecord = function (t) {
            return $http.get($config.api_url + "momento/" + t + "/edit");
        };
        MomentosFactory.getRecords = function () {
            return $http.get($config.api_url + "momento");
        };
        MomentosFactory.getAllRecords = function () {
            return $http.get($config.api_url + "momento/getalldata");
        };
        MomentosFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "momento/" + t, o);
        };
        MomentosFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "momento/get-momento-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        MomentosFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "momento/" + t);
        };
        return MomentosFactory;
    }])
})();