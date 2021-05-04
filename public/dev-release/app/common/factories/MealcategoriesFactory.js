/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('MealcategoriesFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var MealcategoriesFactory = {};

        MealcategoriesFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        MealcategoriesFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "mealcategories", data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealcategoriesFactory.getRecord = function (id) {
            return $http.get($config.api_url + "mealcategories/" + id + "/edit");
        };

        MealcategoriesFactory.getRecords = function () {
            return $http.get($config.api_url + "mealcategories");
        };

        MealcategoriesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealcategories/getalldata");
        };

        MealcategoriesFactory.updateRecord = function (id, data) {
            var formData = objectToFormData(data);        
            return $http.post($config.api_url + "mealcategories/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealcategoriesFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "mealcategories/get-mealcategories-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'mealcategories/get-mealcategories-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        return MealcategoriesFactory;
    }]);
})();