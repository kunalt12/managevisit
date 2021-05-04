/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("DefaulttasksFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var DefaulttasksFactory = {};
        DefaulttasksFactory.validation = {
            task: {
                required: "Task is required",
                minlength: "Task is too short",
                maxlength: "Task is too long"
            },
            status: {
                required: "Please select status"
            }
        };
        DefaulttasksFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "defaulttasks", t);
        };
        DefaulttasksFactory.getRecord = function (t) {
            return $http.get($config.api_url + "defaulttasks/" + t + "/edit");
        };
        DefaulttasksFactory.getRecords = function (t) {
            return $http.get($config.api_url + "defaulttasks/" + t);
        };
        DefaulttasksFactory.getAllRecords = function () {
            return $http.get($config.api_url + "defaulttasks/getalldata");
        };
        DefaulttasksFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "defaulttasks/" + t, o);
        };
        DefaulttasksFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "defaulttasks/get-defaulttasks-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        DefaulttasksFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "defaulttasks/" + t);
        };
        return DefaulttasksFactory;
    }])
})();