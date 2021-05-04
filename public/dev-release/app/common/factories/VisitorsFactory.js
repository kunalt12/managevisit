/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('VisitorsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var VisitorsFactory = {};

    VisitorsFactory.validation = {
        name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
        description: { required: "Description is required" },
        status: { required: "Please select status" }
    };

    VisitorsFactory.addRecord = function(data) {
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "visitors", data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    VisitorsFactory.getRecord = function (id) {
        return $http.get($config.api_url + "visitors/" + id + "/edit");
    };

    VisitorsFactory.getRecords = function () {
        return $http.get($config.api_url + "visitors");
    };

    VisitorsFactory.getAllRecords = function () {
        return $http.get($config.api_url + "visitors/getalldata");
    };

    VisitorsFactory.updateRecord = function (id, data) {
        var formData = objectToFormData(data);        
        return $http.post($config.api_url + "visitors/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    VisitorsFactory.showDataTable = function(data) {
        // return $http.get($config.api_url + "visitors/get-visitors-list");
        return $http({
            method: 'POST',
            url: $config.api_url + 'visitors/get-visitors-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    VisitorsFactory.deleteRecord = function(data) {
        return $http.delete($config.api_url + "visitors/"+data);
    };

    return VisitorsFactory;
}]);
})();