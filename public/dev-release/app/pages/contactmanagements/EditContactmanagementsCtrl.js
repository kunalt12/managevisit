/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.contactmanagements')
    .controller('EditContactmanagementsCtrl', EditContactmanagementsCtrl);

  /** @ngInject */
  function EditContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, UsersFactory, VisitorsFactory, OrganizationsFactory, Contactmanagement, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'Edit Contact Management';
        $scope.btnName = 'Update';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.statusOption = [
            { 'value': 2, 'text': 'Inactive' },
            { 'value': 1, 'text': 'Active' }
        ];

        $scope.genderOption = [
            {label: 'Please select gender', value:''},
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
   
        var $validationProvider = $injector.get('$validation');
         $scope.errorMessage = Contactmanagement.validation;

        Contactmanagement.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('contactmanagements.list');
        });

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;
                $scope.formscope._method = 'PUT';
                
                Contactmanagement.updateRecord($scope.urlID, $scope.formscope).success(function(res) {
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
