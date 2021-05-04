/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
    angular.module('BlurAdmin').factory('ToursFactory', ['$http', '$q', '$config', function($http, $q, $config) {
        var ToursFactory = {};

        ToursFactory.validation = {
            name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
            start_date: { required: "Please select tour date" },
            transport_id: { required: "Please select transport type." },
            tourtype_id: { required: "Please select tour type." },
            location_id: { required: "Please select location." },
            meal_id: { required: "Please select meal type." },
            catering_manager: { required: "Please select catering manager." },
            meal_service_type_id: { required: "Please select meal service type." },
            meal_service_location_id: { required: "Please select meal service location." },
            contact_manager: { required: "Please select contact person." },
            specific_item: { required: "Specific item is required", minlength: "Specific item is too short", maxlength: "Specific item is too long" },
            people: { required: "People count is required", minlength: "People count is too short", maxlength: "People count is too long" },
            senior: { required: "Senior count is required", minlength: "Senior count is too short", maxlength: "Senior count is too long" },
            adults: { required: "Adults count is required", minlength: "Adults count is too short", maxlength: "Adults count is too long" },
            children: { required: "Children count is required", minlength: "Children count is too short", maxlength: "Children count is too long" },
            organization: { required: "Organization name is required", minlength: "Organization name is too short", maxlength: "Organization name is too long" },
            description: { required: "Description is required" },
            request: { required: "Special request is required" },
            status: { required: "Please select status" },

            link: { required: "Link is required", error: "Please enter proper link" },
            title: { required: "Title is required", minlength: "Title is too short", maxlength: "Title is too long" },
            note: { required: "Note is required", minlength: "Note is too short", maxlength: "Note is too long" },

            feedback: { required: "Feedback is required" },
            manager: { required: "Please select tour manager" },
            budget: { required: "Budget is required", minlength: "Budget is too short", maxlength: "Budget is too long" },
            expense_field: { required: "Expense field is required", minlength: "Expense field is too short", maxlength: "Expense field is too long" },
        };

        ToursFactory.addRecord = function(data) {
            // var formData = objectToFormData(data);
            return $http.post($config.api_url + "tours", data);
        };

        ToursFactory.getRecord = function (id) {
            return $http.get($config.api_url + "tours/" + id + "/edit");
        };

        ToursFactory.getRecords = function (id) {
            return $http.get($config.api_url + "tours/" + id);
        };

        ToursFactory.updateRecord = function (id, data) {
            // var formData = objectToFormData(data);
            return $http.post($config.api_url + "tours/"+id, data);
        };

        ToursFactory.viewRecord = function (id) {
            return $http.get($config.api_url + "tours/"+ id);
        };

        ToursFactory.viewFeedback = function (id) {
            return $http.get($config.api_url + "tours/feedback/"+ id);
        };

        ToursFactory.addFeedback = function(data) {
            return $http.post($config.api_url + "tours/add-feedback", data);
        };
        
        ToursFactory.actionRecord = function (data) {
            return $http.post($config.api_url + "tours/tour-action", data);
        };

        ToursFactory.resend = function (data) {
            return $http.post($config.api_url + "tours/resendlink", data);
        };

        ToursFactory.deleteVisitor = function (data) {
            return $http.post($config.api_url + "tours/delete-visitor", data);
        };

        ToursFactory.showDataTable = function(data) {
            return $http({
                method: 'POST',
                url: $config.api_url + 'tours/get-tours-list',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        };

        ToursFactory.addTask = function(data) {
            return $http.post($config.api_url + "tours/add-task", data);
        };

        ToursFactory.updateTask = function (data) {
            return $http.post($config.api_url + "tours/update-task", data);
        };

        ToursFactory.getOrganization = function () {
            return $http.get($config.api_url + "tours/organization-name");
        };

        ToursFactory.actionTask = function (data) {
            return $http.post($config.api_url + "tours/action-task", data);
        };

        ToursFactory.deleteTask = function (id) {
            var data = {
                id:id
            };
            return $http.post($config.api_url + "tours/delete-task", data);
        };


        ToursFactory.tourDocument = function (data) {
            return $http.post($config.api_url + "tours/tour-document", data);
        };

        ToursFactory.deleteDocument = function (data) {
            return $http.post($config.api_url + "tours/delete-document", data);
        };

        ToursFactory.tourNote = function (data) {
            return $http.post($config.api_url + "tours/tour-notes", data);
        };

        ToursFactory.deleteNote = function (data) {
            return $http.post($config.api_url + "tours/delete-notes", data);
        };

        ToursFactory.deleteRecord = function(data) {
            return $http.delete($config.api_url + "tours/"+data);
        };

        return ToursFactory;
    }]);
})();