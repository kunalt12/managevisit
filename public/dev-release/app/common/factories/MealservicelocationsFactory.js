/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('MealservicelocationsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var MealservicelocationsFactory = {};

        MealservicelocationsFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        MealservicelocationsFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "mealservicelocations", data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealservicelocationsFactory.getRecord = function (id) {
            return $http.get($config.api_url + "mealservicelocations/" + id + "/edit");
        };

        MealservicelocationsFactory.getRecords = function () {
            return $http.get($config.api_url + "mealservicelocations");
        };

        MealservicelocationsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "mealservicelocations/getalldata");
        };

        MealservicelocationsFactory.updateRecord = function (id, data) {
            var formData = objectToFormData(data);        
            return $http.post($config.api_url + "mealservicelocations/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealservicelocationsFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "mealservicelocations/get-mealservicelocations-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'mealservicelocations/get-mealservicelocations-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        MealservicelocationsFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "mealservicelocations/"+data);
        };

        return MealservicelocationsFactory;
    }]);
})();