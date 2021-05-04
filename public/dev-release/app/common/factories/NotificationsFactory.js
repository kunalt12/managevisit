/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin').factory('NotificationsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var NotificationsFactory = {};

        NotificationsFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            description: { required: "Description is required" },
            status: { required: "Please select status" }
        };

        NotificationsFactory.addRecord = function(data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "notifications", formData, { headers: { 'Content-Type': undefined } });
        };

        NotificationsFactory.getRecord = function(id) {
            return $http.get($config.api_url + "notifications/" + id + "/edit");
        };

        NotificationsFactory.getRecords = function() {
            return $http.get($config.api_url + "notifications");
        };

        NotificationsFactory.updateRecord = function(id, data) {
            var formData = objectToFormData(data);
            return $http.post($config.api_url + "notifications/" + id, formData, { headers: { 'Content-Type': undefined } });
        };

        NotificationsFactory.showDataTable = function(data) {
            // return $http.get($config.api_url + "notifications/get-notifications-list");
            return $http({
                method: 'POST',
                url: $config.api_url + 'notifications/get-notifications-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        NotificationsFactory.headerNotification = function(id) {
            return $http.get($config.api_url + "notifications/get-recent-notifications");
        };

        NotificationsFactory.markReadNotification = function(data) {
            return $http.post($config.api_url + "notifications/mark-read-to-notification", data);
        };

        return NotificationsFactory;
    }]);
})();