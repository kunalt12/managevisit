/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("VisitorsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var VisitorsFactory = {};
        VisitorsFactory.validation = {
            name: {
                required: "Name is required",
                minlength: "Name is too short",
                maxlength: "Name is too long"
            },
            description: {
                required: "Description is required"
            },
            status: {
                required: "Please select status"
            }
        };
        VisitorsFactory.addRecord = function (t) {
            objectToFormData(t);
            return $http.post($config.api_url + "visitors", t);
        };
        VisitorsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "visitors/" + t + "/edit");
        };
        VisitorsFactory.getRecords = function () {
            return $http.get($config.api_url + "visitors");
        };
        VisitorsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "visitors/getalldata");
        };
        VisitorsFactory.updateRecord = function (t, o) {
            objectToFormData(o);
            return $http.post($config.api_url + "visitors/" + t, o);
        };
        VisitorsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "visitors/get-visitors-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        VisitorsFactory.deleteRecord = function (t) {
            return $http.delete($config.api_url + "visitors/" + t);
        };
        return VisitorsFactory;
    }]);
})();