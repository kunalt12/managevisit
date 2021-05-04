/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("MealcategoriesFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var MealcategoriesFactory = {};
        MealcategoriesFactory.validation = {
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
        MealcategoriesFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "mealcategories", t);
        };
        MealcategoriesFactory.getRecord = function (t) {
            return $http.get($config.api_url + "mealcategories/" + t + "/edit");
        };
        MealcategoriesFactory.getRecords = function () {
            return $http.get($config.api_url + "mealcategories");
        };
        MealcategoriesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealcategories/getalldata");
        };
        MealcategoriesFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "mealcategories/" + t, o);
        };
        MealcategoriesFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "mealcategories/get-mealcategories-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        return MealcategoriesFactory;
    }]);
})();