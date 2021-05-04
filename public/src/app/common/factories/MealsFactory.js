/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("MealsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var MealsFactory = {};
        MealsFactory.validation = {
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
        MealsFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "meals", t);
        };
        MealsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "meals/" + t + "/edit");
        };
        MealsFactory.getRecords = function () {
            return $http.get($config.api_url + "meals");
        };
        MealsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "meals/getalldata");
        };
        MealsFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "meals/" + t, o);
        };
        MealsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "meals/get-meals-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        MealsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "meals/" + t);
        };
        return MealsFactory;
    }]);
})();