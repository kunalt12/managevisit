/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('editProfileCtrl', editProfileCtrl);

    /** @ngInject */
    function editProfileCtrl($scope, fileReader, $filter, $uibModal, $cookies, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = 'Edit User';
        $scope.btnName = "Update Profile";
        $scope.isSubmitted = false;
        $scope.urlID = $rootScope.auth_user.id;

        $scope.uploadPicture = function() {
            var fileInput = document.getElementById('uploadFile');
            fileInput.click();
        };

        UsersFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('roles.list');
        });

        $scope.genderOption = [
            { label: 'Please select gender', value: '' },
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' }
        ];

        /* GET PERMISSIONS */
        $scope.userTypeOption = [{ id: null, name: 'Please select user type' }];
        RolesFactory.roleList().success(function(response) {
            $scope.userTypeOption = $scope.userTypeOption.concat(response.data);
        }).error(function(error) {

        });

        /* GET COUNTRY */
        $scope.countries = [{ id: null, country_name: 'Please select country' }];
        UsersFactory.getCountry().success(function(response) {
            $scope.countries = $scope.countries.concat(response);
        }).error(function(error) {

        });

        UsersFactory.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
            $scope.formscopestatus = {
                status: $scope.formscope.availability
            };
            if ($scope.formscope.image) {
                $scope.imageUrl = config.profile_url + '/' + $scope.formscope.id + '/' + $scope.formscope.image;
            } else {
                $scope.imageUrl = config.profile_url + '/noImage.png';
            }
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('roles.list');
        });

        $scope.errorMessage = UsersFactory.validation;

        /* ADD ROLES */
        $scope.add_data = function(form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form)
                .success(function() {
                    $scope.formscope._method = 'PUT';
                    if ($scope.formscope.dob === undefined) {
                        $scope.formscope.dob = null;
                    } else {
                        $scope.formscope.dob = moment($scope.formscope.dob).format('YYYY-MM-DD');

                        if ($scope.formscope.dob == "Invalid date") {
                            Notification.error("Please enter valid date.");
                            $scope.formscope.dob = '';
                            $scope.isSubmitted = false;
                            return;
                        }

                        var currentDate = new moment().format('YYYY-MM-DD');
                        if ($scope.formscope.dob > currentDate) {
                            Notification.error("Please enter valid date.");
                            $scope.isSubmitted = false;
                            return;
                        }
                    }

                    UsersFactory.editProfile($scope.urlID, $scope.formscope).success(function(response) {
                        Notification.success(response.success);
                        if(response.data.image) {
                            $scope.imageUrl = config.profile_url + '/' + response.data.id + '/' + response.data.image;
                        }
                        else {
                            $scope.imageUrl = config.profile_url + '/noImage.png';
                        }

                        var auth_user = {};
                        auth_user = response.data;

                        $cookies.put("authUser", JSON.stringify(auth_user));
                        // $state.go('users.list');
                        $scope.isSubmitted = false;
                    }).error(function(error) {
                        Notification.error(error.error);
                        $scope.isSubmitted = false;
                    });
                })
                .error(function(error) {
                    $scope.isSubmitted = false;
                });
        };

        $scope.changepassformscope = {};

        /* SET VALIDATION MESSAGE RULES*/
        var $validationProvider = $injector.get('$validation');
        $validationProvider.setExpression({
                confirmPassword: function(value, scope, element, attrs) {
                    return scope.changepassformscope.new_password === scope.changepassformscope.confirm_password;
                }
            })
            .setDefaultMsg({
                confirmPassword: {
                    error: 'Passwords do not match.'
                }
            });

        $scope.change_password = function(form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form).success(function() {
                UsersFactory.updatePassword($scope.urlID, $scope.changepassformscope).success(function(response) {
                    Notification.success(response.success);
                    $scope.isSubmitted = false;
                    $scope.changepassformscope = {};
                }).error(function(error) {
                    Notification.error(error.error);
                    $scope.isSubmitted = false;
                });
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };

        $scope.change_availability = function(form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form)
                .success(function() {
                    if ($scope.formscope.availability === $scope.formscopestatus.status) {
                        Notification.error('You have already defined this availability status. please select other availability status.');
                        $scope.isSubmitted = false;
                    } else {
                        UsersFactory.updateAvailability($scope.urlID, $scope.formscopestatus).success(function(response) {
                            Notification.success(response.success);
                            $scope.formscope.availability = $scope.formscopestatus.status;
                            $scope.formscopestatus.comment = '';
                            $scope.isSubmitted = false;
                        }).error(function(error) {
                            Notification.error(error.error);
                            $scope.isSubmitted = false;
                        });
                    }
                })
                .error(function(error) {
                    $scope.isSubmitted = false;
                });
        };
    }
})();