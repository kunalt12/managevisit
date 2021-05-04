/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('MealservicetypesFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var MealservicetypesFactory = {};

        MealservicetypesFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            cost: { required: "Cost is required", minlength: "Cost is too short", maxlength: "Cost is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        MealservicetypesFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "mealservicetypes", data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealservicetypesFactory.getRecord = function (id) {
            return $http.get($config.api_url + "mealservicetypes/" + id + "/edit");
        };

        MealservicetypesFactory.getRecords = function () {
            return $http.get($config.api_url + "mealservicetypes");
        };

        MealservicetypesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealservicetypes/getalldata");
        };

        MealservicetypesFactory.updateRecord = function (id, data) {
            var formData = objectToFormData(data);        
            return $http.post($config.api_url + "mealservicetypes/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealservicetypesFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "mealservicetypes/get-mealservicetypes-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'mealservicetypes/get-mealservicetypes-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        MealservicetypesFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "mealservicetypes/"+data);
        };
        return MealservicetypesFactory;
    }]);
})();