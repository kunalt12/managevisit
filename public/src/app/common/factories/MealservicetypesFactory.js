/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("MealservicetypesFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var MealservicetypesFactory = {};
        MealservicetypesFactory.validation = {
            name: {
                required: "Name is required",
                minlength: "Name is too short",
                maxlength: "Name is too long"
            },
            cost: {
                required: "Cost is required",
                minlength: "Cost is too short",
                maxlength: "Cost is too long"
            },
            description: {
                required: "Description is required"
            },
            status: {
                required: "Please select status"
            }
        };
        MealservicetypesFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "mealservicetypes", t);
        };
        MealservicetypesFactory.getRecord = function (t) {
            return $http.get($config.api_url + "mealservicetypes/" + t + "/edit");
        };
        MealservicetypesFactory.getRecords = function () {
            return $http.get($config.api_url + "mealservicetypes");
        };
        MealservicetypesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealservicetypes/getalldata");
        };
        MealservicetypesFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "mealservicetypes/" + t, o);
        };
        MealservicetypesFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "mealservicetypes/get-mealservicetypes-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        MealservicetypesFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "mealservicetypes/" + t);
        };
        return MealservicetypesFactory;
    }]);
})();