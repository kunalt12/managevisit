/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.users')
    .controller('AddUsersCtrl', AddUsersCtrl);

  /** @ngInject */
  function AddUsersCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = 'Add User';
        $scope.btnName = "Add";
        $scope.formscope = {
                gender: null, user_type: null, country_id: null, status: 1,
                first_name: '', middle_name: '', last_name: '',
                dob: '',phone_number: '',mobile: '',
                address: '',address1: '',state: '',
                city: '',zip_code: ''
            };
        $scope.isSubmitted = false;
        $scope.loginProgress = false;

        $scope.genderOption = [
            {label: 'Please select gender', value:null},
            {label: 'Male', value: 'm'},
            {label: 'Female', value: 'f'}
        ];

        $scope.statusOption = [
            {label: 'Please select status', value:null},
            {label: 'Active', value: 1},
            {label: 'Inactive', value: 2}
        ];

        /* GET USER ROLE */
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

        $scope.mailModal = function(form){
            $validationProvider.validate(form).success(function() {
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    controller: 'UserMailModalCtrl',
                    templateUrl: 'app/pages/users/mailModal.html',
                    resolve: {
                    }
                }).result.then(function(data) {
                    $scope.add_data(data)
                });
            }).error(function() {
                $scope.isSubmitted = false;
            });                
        }
        
        /* ADD ROLES */
        $scope.add_data = function (mailInfo) {
            $scope.isSubmitted = true;
//            $validationProvider.validate(form).success(function () {
                $scope.loginProgress = true;
                $scope.formscope.password = $rootScope.makeid(8);
                if ($scope.formscope.dob) {
                    $scope.formscope.dob = moment($scope.formscope.dob).format('YYYY-MM-DD');

                    if($scope.formscope.dob == "Invalid date") {
                        Notification.error("Please enter valid date.");
                        $scope.formscope.dob = '';
                        $scope.loginProgress = false;
                        $scope.isSubmitted = false;
                        return;
                    }

                    var currentDate = new moment().format('YYYY-MM-DD');
                    if ($scope.formscope.dob > currentDate) {
                        Notification.error("Please enter valid date.");
                        $scope.loginProgress = false;
                        $scope.isSubmitted = false;
                        return;
                    }
                }
                $scope.formscope.sendMail = mailInfo.sendMail;
                $scope.formscope.mailSubject = mailInfo.mailSubject;
                $scope.formscope.mailContent = mailInfo.mailContent;
                
                UsersFactory.addRecord($scope.formscope).success(function (response) {
                    Notification.success(response.success);
                    $state.go('users.list');
                    $scope.isSubmitted = false;
                }).error(function (error) {
                    $scope.loginProgress = false;
                    Notification.error(error.error);
                    $scope.isSubmitted = false;
                });
//            }).error(function (error) {
//                $scope.isSubmitted = false;
//            });
        };
  }
})();
