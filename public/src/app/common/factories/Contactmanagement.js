/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    "use strict";
    angular.module("BlurAdmin").factory("Contactmanagement", ["$http", "$q", "$config", function ($http, $q, $config) {
        var Contactmanagement = {};
        Contactmanagement.validation = {
            organization_id: {
                required: "Please select organization type"
            },
            visitor_type: {
                required: "Please select visitor type"
            },
            organization: {
                required: "Organization is required",
                minlength: "Organization is too short",
                maxlength: "Organization is too long"
            },
            first_name: {
                required: "First name is required",
                minlength: "First name is too short",
                maxlength: "First name is too long"
            },
            last_name: {
                required: "Last name is required",
                minlength: "Last name is too short",
                maxlength: "Last name is too long"
            },
            email: {
                required: "Email is required",
                invalidEmail: "Email is not valid",
                minlength: "Email is too short",
                maxlength: "Email is too long"
            },
            phone_number: {
                required: "Phone number is required",
                minlength: "Phone number is too short",
                maxlength: "Phone number is too long"
            },
            mobile: {
                required: "Mobile number is required",
                minlength: "Mobile number is too short",
                maxlength: "Mobile number is too long"
            },
            address: {
                required: "Street 1 is required",
                minlength: "Street 1 is too short",
                maxlength: "Street 1 is too long"
            },
            address1: {
                required: "Street 2 is required",
                minlength: "Street 2 is too short",
                maxlength: "Street 2 is too long"
            },
            gender: {
                required: "Please select gender"
            },
            dob: {
                required: "Birth date is required"
            },
            country_id: {
                required: "Please select country"
            },
            state: {
                required: "State is required",
                minlength: "State is too short",
                maxlength: "State is too long"
            },
            city: {
                required: "City is required",
                minlength: "City is too short",
                maxlength: "City is too long"
            },
            zip_code: {
                required: "Zip code is required",
                minlength: "Zip code is too short",
                maxlength: "Zip code is too long"
            },
            status: {
                required: "Please select status"
            },
            meetingtime: {
                required: "Please select meeting time"
            }
        };
        Contactmanagement.addRecord = function (t) {
            return $http.post($config.api_url + "contactmanagements", t);
        };
        Contactmanagement.getRecord = function (t) {
            return $http.get($config.api_url + "contactmanagements/" + t + "/edit");
        };
        Contactmanagement.getAllRecord = function (t) {
            return $http.get($config.api_url + "contactmanagements");
        };
        Contactmanagement.updateRecord = function (t, o) {
            return $http.post($config.api_url + "contactmanagements/" + t, o);
        };
        Contactmanagement.checkRecordByPhone = function (t) {
            return $http.post($config.api_url + "contactmanagements/checkvitisitorphone", t);
        };
        Contactmanagement.showDataTable = function (t) {
            return $http({
                method: "POST",
                url: $config.api_url + "contactmanagements/get-contactmanagements-list",
                data: $.param(t),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        };
        Contactmanagement.deleteRecord = function (t) {
            return $http.delete($config.api_url + "contactmanagements/" + t);
        };
        return Contactmanagement;
    }]);
})();