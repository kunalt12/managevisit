/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin').factory('MomentosFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var MomentosFactory = {};

        MomentosFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        MomentosFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "momento", data /*formData, { headers: { 'Content-Type': undefined } }*/);
        };

        MomentosFactory.getRecord = function(id) {
            return $http.get($config.api_url + "momento/" + id + "/edit");
        };

        MomentosFactory.getRecords = function() {
            return $http.get($config.api_url + "momento");
        };

        MomentosFactory.getAllRecords = function () {
            return $http.get($config.api_url + "momento/getalldata");
        };

        MomentosFactory.updateRecord = function(id, data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "momento/" + id, data /*formData, { headers: { 'Content-Type': undefined } }*/);
        };

        MomentosFactory.showDataTable = function(data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'momento/get-momento-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        MomentosFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "momento/"+data);
        };

        return MomentosFactory;
    }]);
})();