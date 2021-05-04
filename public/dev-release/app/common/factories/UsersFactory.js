/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';
angular.module('BlurAdmin').factory('UsersFactory', ['$http', '$q', '$config', function($http, $q, $config) {
    var UsersFactory = {};

    UsersFactory.validation = {
        name: { required: "Name is required", minlength: "Name is too short", maxlength: "Name is too long" },
        description: { required: "Description is required" },
        first_name: { required: "First name is required", minlength: "First name is too short", maxlength: "First name is too long" },
        last_name: { required: "Last name is required", minlength: "Last name is too short", maxlength: "Last name is too long" },
        email: { required: "Email is required", invalidEmail: "Email is not valid", minlength: "Email is too short", maxlength: "Email is too long" },
        phone_number: { required: "Phone number is required", minlength: "Phone number is too short", maxlength: "Phone number is too long" },
        mobile: { required: "Mobile number is required", minlength: "Mobile number is too short", maxlength: "Mobile number is too long" },
        address: { required: "Street 1 is required", minlength: "Street 1 is too short", maxlength: "Street 1 is too long" },
        address1: { required: "Street 2 is required", minlength: "Street 2 is too short", maxlength: "Street 2 is too long" },
        gender: { required: "Please select gender"},
        dob: { required: "Birth date is required"},
        status: { required: "Please select status"},
        user_type: { required: "Please select user type"},
        country_id: { required: "Please select country"},
        state: { required: "State is required", minlength: "State is too short", maxlength: "State is too long" },
        city: { required: "City is required", minlength: "City is too short", maxlength: "City is too long" },
        zip_code: { required: "Zip code is required", minlength: "Zip code is too short", maxlength: "Zip code is too long" },
        image: { required: "File is required", pdfFile: "Please upload only image.", maxSize: "File is too large" },

        password: { required: "Password is required", minlength: "Password is too short", maxlength: "Password is too long" },
        new_password: { required: "New password is required", minlength: "New password is too short", maxlength: "New password is too long" },
        confirm_password: { required: "Confirm password is required" },
    };

    UsersFactory.addRecord = function(data) {
        // var formData = objectToFormData(data);
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "users", formData, { headers: {'Content-Type': undefined }});
        // return $http.post($config.api_url + "users", data);
    };

    UsersFactory.getRecord = function (id) {
        return $http.get($config.api_url + "users/" + id + "/edit");
    };

    UsersFactory.getRecords = function () {
        return $http.get($config.api_url + "users");
    };

    UsersFactory.getTourManager = function () {
        return $http.get($config.api_url + "users/tour-manager");
    };

    UsersFactory.updateRecord = function (id, data) {
        var formData = objectToFormData(data);
        // return $http.post($config.api_url + "users/"+id, data);
        return $http.post($config.api_url + "users/"+id, formData, { headers: {'Content-Type': undefined }});
    };

    UsersFactory.editProfile = function (id, data) {
        var formData = objectToFormData(data);
        return $http.post($config.api_url + "users/"+id, formData, { headers: {'Content-Type': undefined }});
        // return $http.post($config.api_url + "users/"+id, data);
    };

    UsersFactory.getVolunteers = function (data) {
        return $http.post($config.api_url + "users/get-volunteers-user", data);
    };

    UsersFactory.getCountry = function () {
        return $http.get($config.api_url + "get-countries");
    };

    UsersFactory.updatePassword = function(id, data) {
        data._method = "PUT";
        return $http.post($config.api_url + "users/change-password/" + id, data);
    };

    UsersFactory.updateAvailability = function(id, data) {
        data._method = "PUT";
        return $http.post($config.api_url + "users/change-availability/" + id, data);
    };

    UsersFactory.changePassword = function(id, data) {
        data._method = "PUT";
        return $http.post($config.api_url + "users/admin-change-password/" + id, data);
    };

    UsersFactory.resendEmail = function (data) {
        return $http.post($config.api_url + "users/resend-welcome-email", data);
    };
    
    UsersFactory.showDataTable = function(data) {
        return $http({
            method: 'POST',
            url: $config.api_url + 'users/get-users-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    UsersFactory.showAvailabilitiesDataTable = function(data) {
        return $http({
            method: 'POST',
            url: $config.api_url + 'users/get-availabilities-list',
            data: $.param(data),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    UsersFactory.deleteRecord = function(data) {
        return $http.delete($config.api_url + "users/"+data);
    };

    return UsersFactory;
}]);
})();