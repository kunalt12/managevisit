/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin').factory('ApiManagementsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var ApiManagementsFactory = {};

        ApiManagementsFactory.validation = {
            name: { required: "Company name is required", minlength: "Company name is too short", maxlength: "Company name is too long" },
            api_key: { required: "API key is required", minlength: "API key is too short", maxlength: "API key is too long" },
            slug: { required: "Slug is required", minlength: "Slug is too short", maxlength: "Slug is too long", duplicate: "Slug is already exist please chose other slug." },
            status: { required: "Please select status" },
            ipaddress: { required: "Ip address is required" }
        };

        ApiManagementsFactory.addRecord = function(data) {
            return $http.post($config.api_url + "apimanagements", data);
        };

        ApiManagementsFactory.getRecord = function(id) {
            return $http.get($config.api_url + "apimanagements/" + id + "/edit");
        };

        ApiManagementsFactory.updateRecord = function(id, data) {
            return $http.post($config.api_url + "apimanagements/" + id, data);
        };

        ApiManagementsFactory.checkSlug = function(data) {
            return $http.post($config.api_url + "apimanagements/check-slug", data);
        };

        ApiManagementsFactory.showDataTable = function(data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'apimanagements/get-apimanagements-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };
        
        ApiManagementsFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "apimanagements/"+data);
        };
        
        return ApiManagementsFactory;
    }]);
})();