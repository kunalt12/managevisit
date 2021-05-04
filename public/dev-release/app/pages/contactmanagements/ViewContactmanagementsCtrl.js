/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.contactmanagements')
        .controller('ViewContactmanagementsCtrl', ViewContactmanagementsCtrl);

    /** @ngInject */
    function ViewContactmanagementsCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $stateParams, OrganizationsFactory, Contactmanagement, $timeout, ngDialog, $config) {
        $scope.pageName = 'Contact - View';
        $scope.btnName = "View";
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;

        $scope.genderOption = [
            { label: '-', value: '' },
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' }
        ];

        $scope.OrganizationOption = [{name: '-', id: null}];
        OrganizationsFactory.getRecords().success(function(response) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(response.data);
        }).error(function(error) {
            
        });

        $scope.showStatus = function(user) {
            var selected = [];
            if (user) {
                if (user.gender !== undefined || user.gender != null || user.gender != '') {
                    selected = $filter('filter')($scope.genderOption, { value: user.gender });
                }
                return selected.length ? selected[0].label : '-';
            } else {
                return '-';
            }
        };

        $scope.organizationType = function(user) {
            var selected = [];
            if (user) {
                if (user.organization_id !== undefined || user.organization_id != null || user.organization_id != '') {
                    selected = $filter('filter')($scope.OrganizationOption, { id: user.organization_id });
                }
                return selected.length ? selected[0].name : '-';
            } else {
                return '-';
            }
        };

        Contactmanagement.getRecord($scope.urlID).success(function(response) {
            $scope.formscope = response.data;
        }).error(function(error) {
            Notification.error(error.error);
            $state.go('roles.list');
        });
    }
})();