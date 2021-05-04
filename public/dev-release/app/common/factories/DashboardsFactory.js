/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';
    angular.module('BlurAdmin').factory('DashboardsFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var DashboardsFactory = {};

        DashboardsFactory.validation = {
            task: { required: "Task is required", minlength: "Task is too short", maxlength: "Task is too long" },
            status: { required: "Please select status" }
        };

        DashboardsFactory.getRecord = function() {
            return $http.get($config.api_url + "dashboard");
        };

        DashboardsFactory.getCalenderRecord = function() {
            return $http.get($config.api_url + "dashboard/calender-data");
        };

        DashboardsFactory.getTourDataTable = function(data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'dashboard/upcoming-tour',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        return DashboardsFactory;
    }]);
})();