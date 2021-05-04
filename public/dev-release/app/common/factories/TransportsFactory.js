/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('TransportsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var TransportsFactory = {};

    TransportsFactory.validation = {
        name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
        description: { required: "Description is required" },
        status: { required: "Please select status" }
    };

    TransportsFactory.addRecord = function(data) {
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "transports", data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    TransportsFactory.getRecord = function (id) {
        return $http.get($config.api_url + "transports/" + id + "/edit");
    };

    TransportsFactory.getRecords = function () {
        return $http.get($config.api_url + "transports");
    };

    TransportsFactory.getAllRecords = function () {
        return $http.get($config.api_url + "transports/getalldata");
    };

    TransportsFactory.updateRecord = function (id, data) {
        var formData = objectToFormData(data);        
        return $http.post($config.api_url + "transports/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    TransportsFactory.showDataTable = function(data) {
        // return $http.get($config.api_url + "transports/get-transports-list");
        return $http({
            method: 'POST',
            url: $config.api_url + 'transports/get-transports-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    TransportsFactory.deleteRecord = function(data) {
        return $http.delete($config.api_url + "transports/"+data);
    };

    return TransportsFactory;
}]);
})();