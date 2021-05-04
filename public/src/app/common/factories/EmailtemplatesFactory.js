/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
        "use strict";
        angular.module("BlurAdmin").factory("EmailtemplatesFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
            var EmailtemplatesFactory = {};
            EmailtemplatesFactory.validation = {
                title: {
                    required: "Title is required",
                    minlength: "Title is too short",
                    maxlength: "Title is too long"
                },
                emailtype: {
                    required: "Please select Email Action"
                },
                html_code: {
                    required: "Description is required"
                },
                status: {
                    required: "Please select status"
                }
            };
            EmailtemplatesFactory.addRecord = function (t) {
                objectToFormData(t);
                return $http.post($config.api_url + "emailtemplates", t)
            };
            EmailtemplatesFactory.getRecord = function (t) {
                return $http.get($config.api_url + "emailtemplates/" + t + "/edit")
            };
            EmailtemplatesFactory.getRecords = function () {
                return $http.get($config.api_url + "emailtemplates")
            };
            EmailtemplatesFactory.getAllRecords = function () {
                return $http.get($config.api_url + "emailtemplates/getalldata")
            };
            EmailtemplatesFactory.updateRecord = function (t, o) {
                objectToFormData(o);
                return $http.post($config.api_url + "emailtemplates/" + t, o)
            };
            EmailtemplatesFactory.showDataTable = function (t) {
                return $http({
                    method: "POST",
                    url: $config.api_url + "emailtemplates/get-emailtemplates-list",
                    data: $.param(t),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            };
            EmailtemplatesFactory.deleteRecord = function (t) {
                return $http.delete($config.api_url + "emailtemplates/" + t)
            };
            return EmailtemplatesFactory;
        }]);
})();