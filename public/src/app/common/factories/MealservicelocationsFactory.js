/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("MealservicelocationsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var MealservicelocationsFactory = {};
        MealservicelocationsFactory.validation = {
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
        MealservicelocationsFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "mealservicelocations", t);
        };
        MealservicelocationsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "mealservicelocations/" + t + "/edit");
        };
        MealservicelocationsFactory.getRecords = function () {
            return $http.get($config.api_url + "mealservicelocations");
        };
        MealservicelocationsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealservicelocations/getalldata");
        };
        MealservicelocationsFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "mealservicelocations/" + t, o);
        };
        MealservicelocationsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "mealservicelocations/get-mealservicelocations-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        MealservicelocationsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "mealservicelocations/" + t);
        };
        return MealservicelocationsFactory;
    }]);
})();