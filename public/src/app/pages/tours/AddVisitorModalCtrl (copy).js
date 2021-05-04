/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddVisitorModalCtrl', AddVisitorModalCtrl);

    /** @ngInject */
    function AddVisitorModalCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, $injector, $uibModalInstance, Notification, UsersFactory, Contactmanagement, ToursFactory, VisitorsFactory, OrganizationsFactory, organizationName, organizationNameData, visitorInfo) {
        $scope.visitorUser = {};
        $scope.formscope = { gender: null, organization_id: null, visitor_type: null, country_id: null, organization: organizationName };
        // if(visitorInfo) {
        //     $scope.formscope = visitorInfo;
        // }
        $scope.btnName = 'Add';
        $scope.isSubmitted = false;


        $scope.genderOption = [
            { label: 'Please select gender', value: null },
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' }
        ];

        // $scope.visitorsOption = [];
        // Contactmanagement.getAllRecord().success(function(response) {
        //     $scope.visitorsOption = response.data;
        // }).error(function(error) {

        // });

        $scope.organizationNameOption = organizationNameData;

        $scope.residentSelected = function(selected) {
            if (selected) {
                if (selected.originalObject.organization) {
                    $scope.formscope.organization = selected.originalObject.organization;
                } else {
                    $scope.formscope.organization = selected.originalObject;
                }
            }
        };

        // $scope.visitorSelected = function(selected) {
        //     if (selected) {
        //         if (selected.originalObject.name) {
        //             $scope.formscope = selected.originalObject;
        //         }
        //     }
        // };

        /* GET COUNTRY */
        $scope.countries = [{ id: null, country_name: 'Please select country' }];
        UsersFactory.getCountry().success(function(response) {
            $scope.countries = $scope.countries.concat(response);
        }).error(function(error) {

        });

        $scope.OrganizationOption = [{ name: 'Please select organization type', id: null }];
        OrganizationsFactory.getRecords().success(function(response) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(response.data);
        }).error(function(error) {

        });

        $scope.VisitorOption = [{ name: 'Please select visitor type', id: null }];
        VisitorsFactory.getRecords().success(function(response) {
            $scope.VisitorOption = $scope.VisitorOption.concat(response.data);
        }).error(function(error) {

        });

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = Contactmanagement.validation;

        $scope.checkPhoneNumber = function(key, value) {
            if (key && value) {
                var data = {
                    search_key: key,
                    search_value: value
                };

                Contactmanagement.checkRecordByPhone(data).success(function(response) {
                    if (response.data) {
                        $scope.formscope = response.data;
                    }
                }).error(function(error) {

                });
            }
        };

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.formscope.name = $scope.formscope.first_name + " " + $scope.formscope.last_name
                $scope.formscope.gender_txt = $scope.genderOption.filter(function(option) {
                    return option.value === $scope.formscope.gender;
                })[0].label;

                $scope.formscope.organization_txt = $scope.OrganizationOption.filter(function(option) {
                    return option.id === $scope.formscope.organization_id;
                })[0].name;

                $scope.formscope.visitor_txt = $scope.VisitorOption.filter(function(option) {
                    return option.id === $scope.formscope.visitor_type;
                })[0].name;

                $uibModalInstance.close($scope.formscope);
            }).error(function() {
                $scope.isSubmitted = false;
            });
        };
    }
})();