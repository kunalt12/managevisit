/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('OrganizationsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var OrganizationsFactory = {};

        OrganizationsFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        OrganizationsFactory.addRecord = function(data) {
            /*var formData = objectToFormData(data);
            return $http.post($config.api_url + "organizations", formData, { headers: {'Content-Type': undefined }});*/
            return $http.post($config.api_url + "organizations", data);
        };

        OrganizationsFactory.getRecord = function (id) {
            return $http.get($config.api_url + "organizations/" + id + "/edit");
        };

        OrganizationsFactory.getRecords = function () {
            return $http.get($config.api_url + "organizations");
        };

        OrganizationsFactory.getAllRecords = function () {
            return $http.get($config.api_url + "organizations/getalldata");
        };

        OrganizationsFactory.updateRecord = function (id, data) {
            /*var formData = objectToFormData(data);        
            return $http.post($config.api_url + "organizations/"+id, formData, { headers: {'Content-Type': undefined }});*/
            return $http.post($config.api_url + "organizations/"+id, data);
        };

        OrganizationsFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "organizations/get-organizations-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'organizations/get-organizations-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        OrganizationsFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "organizations/"+data);
        };

        return OrganizationsFactory;
    }]);
})();