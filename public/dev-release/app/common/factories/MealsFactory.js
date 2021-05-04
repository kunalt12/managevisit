/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('MealsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var MealsFactory = {};

        MealsFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        MealsFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "meals", data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealsFactory.getRecord = function (id) {
            return $http.get($config.api_url + "meals/" + id + "/edit");
        };

        MealsFactory.getRecords = function () {
            return $http.get($config.api_url + "meals");
        };

        MealsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "meals/getalldata");
        };
        
        MealsFactory.updateRecord = function (id, data) {
            var formData = objectToFormData(data);        
            return $http.post($config.api_url + "meals/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        MealsFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "meals/get-meals-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'meals/get-meals-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        MealsFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "meals/"+data);
        };

        return MealsFactory;
    }]);
})();