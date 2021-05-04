/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('TourtypesFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var TourtypesFactory = {};

        TourtypesFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            status: { required: "Please select status" }
        };

        TourtypesFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "tourtypes", data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        TourtypesFactory.getRecord = function (id) {
            return $http.get($config.api_url + "tourtypes/" + id + "/edit");
        };

        TourtypesFactory.getRecords = function () {
            return $http.get($config.api_url + "tourtypes");
        };

        TourtypesFactory.viewRecord = function (id) {
            return $http.get($config.api_url + "tourtypes/"+ id);
        };

        TourtypesFactory.getAllRecords = function () {
            return $http.get($config.api_url + "tourtypes/getalldata");
        };

        TourtypesFactory.getAllRecords = function () {
            return $http.post($config.api_url + "tourtypes/get-all-tourtype");
        };

        TourtypesFactory.updateRecord = function (id, data) {
            var formData = objectToFormData(data);        
            return $http.post($config.api_url + "tourtypes/"+id, data /*formData, { headers: {'Content-Type': undefined }}*/);
        };

        TourtypesFactory.showDataTable = function(data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'tourtypes/get-tourtypes-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        TourtypesFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "tourtypes/"+data);
        };

        return TourtypesFactory;
    }]);
})();