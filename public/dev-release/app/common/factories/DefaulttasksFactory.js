/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('DefaulttasksFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var DefaulttasksFactory = {};

    DefaulttasksFactory.validation = {
        task: { required: "Task is required", minlength: "Task is too short", maxlength: "Task is too long" },
        status: { required: "Please select status" }
    };

    DefaulttasksFactory.addRecord = function(data) {
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "defaulttasks", data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    DefaulttasksFactory.getRecord = function (id) {
        return $http.get($config.api_url + "defaulttasks/" + id + "/edit");
    };

    DefaulttasksFactory.getRecords = function (id) {
        return $http.get($config.api_url + "defaulttasks/" + id);
    };

    DefaulttasksFactory.getAllRecords = function () {
        return $http.get($config.api_url + "defaulttasks/getalldata");
    };

    DefaulttasksFactory.updateRecord = function (id, data) {
        var formData = objectToFormData(data);        
        return $http.post($config.api_url + "defaulttasks/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
    };

    DefaulttasksFactory.showDataTable = function(data) {
        // return $http.get($config.api_url + "defaulttasks/get-defaulttasks-list");
        return $http({
            method: 'POST',
            url: $config.api_url + 'defaulttasks/get-defaulttasks-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    DefaulttasksFactory.deleteRecord = function(data) {
        return $http.delete($config.api_url + "defaulttasks/"+data);
    };

    return DefaulttasksFactory;
}]);
})();