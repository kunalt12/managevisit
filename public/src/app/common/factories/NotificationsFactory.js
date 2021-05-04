/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("NotificationsFactory", ["$http", "$q", "$config", function ($http, $q, $config) {
        var NotificationsFactory = {};
        NotificationsFactory.validation = {
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
        NotificationsFactory.addRecord = function (t) {
            var o = objectToFormData(t);
            return $http.post($config.api_url + "notifications", o, {
                headers: {
                    "Content-Type": void 0
                }
            });
        };
        NotificationsFactory.getRecord = function (t) {
            return $http.get($config.api_url + "notifications/" + t + "/edit");
        };
        NotificationsFactory.getRecords = function () {
            return $http.get($config.api_url + "notifications");
        };
        NotificationsFactory.updateRecord = function (t, o) {
            var s = objectToFormData(o);
            return $http.post($config.api_url + "notifications/" + t, s, {
                headers: {
                    "Content-Type": void 0
                }
            });
        };
        NotificationsFactory.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "notifications/get-notifications-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        NotificationsFactory.headerNotification = function (t) {
            return $http.get($config.api_url + "notifications/get-recent-notifications");
        };
        NotificationsFactory.markReadNotification = function (t) {
            return $http.post($config.api_url + "notifications/mark-read-to-notification", t);
        };
        return NotificationsFactory;
    }]);
})();