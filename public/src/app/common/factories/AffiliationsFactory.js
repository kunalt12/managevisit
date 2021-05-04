/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
        "use strict";
        angular.module("BlurAdmin").factory("AffiliationsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
            var AffiliationsFactory = {};
            AffiliationsFactory.validation = {
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
            AffiliationsFactory.addRecord = function (t) {
                objectToFormData(t);
                return $http.post($config.api_url + "affiliations", t)
            };
            AffiliationsFactory.getRecord = function (t) {
                return $http.get($config.api_url + "affiliations/" + t + "/edit")
            };
            AffiliationsFactory.getRecords = function () {
                return $http.get($config.api_url + "affiliations")
            };
            AffiliationsFactory.getAllRecords = function () {
                return $http.get($config.api_url + "affiliations/getalldata")
            };
            AffiliationsFactory.updateRecord = function (t, o) {
                objectToFormData(o);
                return $http.post($config.api_url + "affiliations/" + t, o)
            };
            AffiliationsFactory.showDataTable = function (t) {
                return $http({
                    method: "POST",
                    url: $config.api_url + "affiliations/get-affiliations-list",
                    data: $.param(t),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
            };
            AffiliationsFactory.deleteRecord = function (t) {
                return $http.delete($config.api_url + "affiliations/" + t)
            };
            return AffiliationsFactory;
        }]);
    })();