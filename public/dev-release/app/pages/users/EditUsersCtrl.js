/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
    .controller('EditUsersCtrl', EditUsersCtrl);

  /** @ngInject */
  function EditUsersCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = 'Edit User';
        $scope.btnName = "Update";
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        UsersFactory.getRecord($scope.urlID).success(function (response) {
            $scope.formscope = response.data;
        }).error(function (error) {
                Notification.error(error.error);
                $state.go('roles.list');
        });

        $scope.genderOption = [
            {label: 'Please select gender', value:''},
            {label: 'Male', value: 'm'},
            {label: 'Female', value: 'f'}
        ];

        $scope.statusOption = [
            {label: 'Please select status', value:null},
            {label: 'Active', value: 1},
            {label: 'Inactive', value: 2}
        ];

        /* GET PERMISSIONS */
        $scope.userTypeOption = [{ id: null, name: 'Please select user type' }];
        RolesFactory.roleList().success(function (response) {
            $scope.userTypeOption = $scope.userTypeOption.concat(response.data);
        }).error(function (error) {

        });

        /* GET COUNTRY */
        $scope.countries = [{ id: null, country_name: 'Please select country' }];
        UsersFactory.getCountry().success(function (response) {
            $scope.countries = $scope.countries.concat(response);
        }).error(function (error) {

        });

        $scope.errorMessage = UsersFactory.validation;

        /* SET VALIDATION MESSAGE RULES*/
        var $validationProvider = $injector.get('$validation');
        $validationProvider.setExpression({
            confirmPassword: function(value, scope, element, attrs) {
                return scope.formscope.password === scope.formscope.confirm_password;
            }
        })
        .setDefaultMsg({
            confirmPassword: {
                error: 'Passwords do not match.'
            }
        });

        /* ADD ROLES */
        $scope.add_data = function (form) {
            $scope.isSubmitted = true;
            $validationProvider.validate(form)
                    .success(function () {
                        $scope.formscope._method = 'PUT';
                        if ($scope.formscope.dob === undefined || $scope.formscope.dob === null) {
                            $scope.formscope.dob = null;
                        }
                        else {
                            $scope.formscope.dob = moment($scope.formscope.dob).format('YYYY-MM-DD');
                            if($scope.formscope.dob == "Invalid date") {
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
                        
                        UsersFactory.updateRecord($scope.urlID, $scope.formscope).success(function (response) {
                            Notification.success(response.success);
                            $state.go('users.list');
                            $scope.isSubmitted = false;
                        }).error(function (error) {
                            Notification.error(error.error);
                            $scope.isSubmitted = false;
                        });
                    })
                    .error(function (error) {
                        $scope.isSubmitted = false;
                    });
        };
  }
})();
