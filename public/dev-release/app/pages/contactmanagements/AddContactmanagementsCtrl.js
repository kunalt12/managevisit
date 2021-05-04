/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.contactmanagements')
    .controller('AddContactmanagementsCtrl', AddContactmanagementsCtrl);

  /** @ngInject */
  function AddContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, VisitorsFactory, OrganizationsFactory, Contactmanagement, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Add Contact Management';
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;
        $scope.formscope = {gender: null, organization_id:null, visitor_type:null, country_id:null, status:1};
        
        $scope.statusOption = [
            { 'value': 2, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        $scope.genderOption = [
            {label: 'Please select gender', value:null},
            {label: 'Male', value: 'm'},
            {label: 'Female', value: 'f'}
        ];

        $scope.OrganizationOption = [{name: 'Please select organization type', id:null}];
        $scope.VisitorOption = [{name: 'Please select visitor type', id:null}];

        OrganizationsFactory.getRecords().success(function(response) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(response.data);
        }).error(function(error) {
            
        });

        VisitorsFactory.getRecords().success(function(response) {
            $scope.VisitorOption = $scope.VisitorOption.concat(response.data);
        }).error(function(error) {
            
        });

        /* GET COUNTRY */
        $scope.countries = [{ id: null, country_name: 'Please select country' }];
        UsersFactory.getCountry().success(function (response) {
            $scope.countries = $scope.countries.concat(response);
        }).error(function (error) {

        });

        $scope.errorMessage = Contactmanagement.validation;
        var $validationProvider = $injector.get('$validation');
        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                Contactmanagement.addRecord($scope.formscope).success(function(res) {
                    Notification.success(res.success);
                    $state.go('contactmanagements.list');
                    $scope.isSubmitted = false;
                }).error(function(err) {
                    Notification.error(err.error);
                    $scope.isSubmitted = false;
                });
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
  }
})();


