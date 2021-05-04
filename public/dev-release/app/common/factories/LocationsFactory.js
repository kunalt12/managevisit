/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('LocationsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var LocationsFactory = {};

    LocationsFactory.validation = {
        name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
        description: { required: "Description is required" },
        status: { required: "Please select status" }
    };

    LocationsFactory.addRecord = function(data) {
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "locations", data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    LocationsFactory.getRecord = function (id) {
        return $http.get($config.api_url + "locations/" + id + "/edit");
    };

    LocationsFactory.getRecords = function () {
        return $http.get($config.api_url + "locations");
    };

    LocationsFactory.getAllRecords = function () {
        return $http.get($config.api_url + "locations/getalldata");
    };

    LocationsFactory.updateRecord = function (id, data) {
        var formData = objectToFormData(data);        
        return $http.post($config.api_url + "locations/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    LocationsFactory.showDataTable = function(data) {
        // return $http.get($config.api_url + "locations/get-locations-list");
        return $http({
            method: 'POST',
            url: $config.api_url + 'locations/get-locations-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    LocationsFactory.deleteRecord = function(data) {
        return $http.delete($config.api_url + "locations/"+data);
    };

    return LocationsFactory;
}]);
})();