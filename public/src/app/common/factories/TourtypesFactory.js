/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("TourtypesFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var TourtypesFactory = {};
        TourtypesFactory.validation = {
            name: {
                required: "Name is required",
                minlength: "Name is too short",
                maxlength: "Name is too long"
            },
            status: {
                required: "Please select status"
            }
        };
        TourtypesFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "tourtypes", t);
        };
        TourtypesFactory.getRecord = function (t) {
            return $http.get($config.api_url + "tourtypes/" + t + "/edit");
        };
        TourtypesFactory.getRecords = function () {
            return $http.get($config.api_url + "tourtypes");
        };
        TourtypesFactory.viewRecord = function (t) {
            return $http.get($config.api_url + "tourtypes/" + t);
        };
        TourtypesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "tourtypes/getalldata");
        };
        TourtypesFactory.getAllRecords = function () {
            return $http.post($config.api_url + "tourtypes/get-all-tourtype");
        };
        TourtypesFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "tourtypes/" + t, o);
        };
        TourtypesFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "tourtypes/get-tourtypes-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        TourtypesFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "tourtypes/" + t);
        };
        return TourtypesFactory;
    }])
})();