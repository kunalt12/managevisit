/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddVisitorModalCtrl', AddVisitorModalCtrl);

    /** @ngInject */
    function AddVisitorModalCtrl($scope, fileReader, $filter, $timeout, $uibModal, $rootScope, $compile, $injector, $uibModalInstance, Notification, UsersFactory, Contactmanagement, ToursFactory, VisitorsFactory, OrganizationsFactory, organizationName, organizationNameData, visitorInfo, MomentosFactory, isEdit) {
        $scope.visitorUser = {};
        $scope.formscope = { gender: null, momentos: null, organization_id: null, visitor_type: null, country_id: null, organization: organizationName };

        $scope.btnName = 'Add';
        $scope.isSubmitted = false;
        $scope.titleName = 'Add Visitor';

        $scope.addMomento = isEdit;
        if (visitorInfo.first_name) {
            $scope.btnName = 'Update';
            $scope.titleName = 'Edit Visitor';
            $scope.formscope.first_name = visitorInfo.first_name;
            $scope.formscope.middle_name = visitorInfo.middle_name;
            $scope.formscope.last_name = visitorInfo.last_name;
            $scope.formscope.email = visitorInfo.email;
            $scope.formscope.mobile = visitorInfo.mobile;
            $scope.formscope.phone_number = visitorInfo.phone_number;
            $scope.formscope.gender = visitorInfo.gender;
            $scope.formscope.visitor_type = visitorInfo.visitor_type;
            $scope.formscope.organization_id = visitorInfo.organization_id;
            $scope.formscope.organization = visitorInfo.organization;
            $scope.formscope.address = visitorInfo.address;
            $scope.formscope.address1 = visitorInfo.address1;
            $scope.formscope.country_id = visitorInfo.country_id;
            $scope.formscope.state = visitorInfo.state;
            $scope.formscope.city = visitorInfo.city;
            $scope.formscope.zip_code = visitorInfo.zip_code;
            $scope.formscope.momentos = visitorInfo.momentos;
            
            //$scope.formscope = visitorInfo;
        }

        $scope.$broadcast('angucomplete-alt:changeInput', 'organization', organizationName);

        $scope.showDropdownFirstName = false;
        $scope.showDropdownLastName = false;
        $scope.showDropdownEmail = false;
        $scope.showDropdownMobile = false;

        $scope.searching = false;
        $scope.textNoResults = "";

        $scope.genderOption = [
            { label: 'Please select gender', value: null },
            { label: 'Male', value: 'm' },
            { label: 'Female', value: 'f' }
        ];


        $scope.closePopup = function(event) {
            $scope.searchResult1 = [];
            $scope.showDropdownFirstName = false;
            $scope.showDropdownLastName = false;
        };

        $scope.hoverRow = function(index) {
            $scope.currentIndex = index;
        };

        $scope.searchResult1 = [];
        $scope.checkPhoneNumber = function(value, filed, e) {
            if (value) {
                var data = {
                    search_value: value
                };

                if(e) {
                    if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                        if (value.length >= 2) {
                            Contactmanagement.checkRecordByPhone(data).success(function(response) {
                                if (response.data.length != 0) {
                                    $scope.searchResult1 = response.data;
                                    if (filed == 'first_name') {
                                        $scope.showDropdownFirstName = true;
                                    } else if (filed == 'last_name') {
                                        $scope.showDropdownLastName = true;
                                    } else if (filed == 'email') {
                                        $scope.showDropdownEmail = true;
                                    } else if (filed == 'mobile') {
                                        $scope.showDropdownMobile = true;
                                    }
                                    $scope.searching = true;
                                } else {
                                    $scope.searchResult1 = [];
                                    $scope.textNoResults = "No results found";
                                }
                            }).error(function(error) {

                            });
                        }
                    }
                }
            } else {
                $scope.searchResult1 = [];
                if (filed == 'first_name') {
                    $scope.showDropdownFirstName = false;
                } else if (filed == 'last_name') {
                    $scope.showDropdownLastName = false;
                } else if (filed == 'email') {
                    $scope.showDropdownEmail = false;
                } else if (filed == 'mobile') {
                    $scope.showDropdownMobile = false;
                }
            }
        };

        $scope.selectResult = function(selected) {
            if (selected.name) {
                $scope.formscope = {};

                $scope.formscope = selected;
                $scope.formscope.name = selected.first_name + " " + selected.last_name;

                $scope.$broadcast('angucomplete-alt:changeInput', 'firstName', selected.first_name);
                $scope.$broadcast('angucomplete-alt:changeInput', 'lastName', selected.last_name);
                $scope.$broadcast('angucomplete-alt:changeInput', 'email', selected.email);
                $scope.$broadcast('angucomplete-alt:changeInput', 'mobile', selected.mobile);
                // $scope.showDropdown = false;
            } else {
                $scope.formscope.first_name = selected;
            }
        }

        $scope.searchMobileResult = [];
        /*$scope.checkNumber = function() {
            var searchData = {
                search_value: $scope.formscope.mobile
            };

            Contactmanagement.checkRecordByPhone(searchData).success(function(response) {
                $scope.searchMobileResult = response;
            }).error(function(error) {

            });

            return $timeout(function() {
                return $scope.searchMobileResult;
            }, 500);
            // if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) { 

            // }
            // else {
            //     var str = $scope.formscope.mobile;
            //     // $scope.formscope.mobile = str.replace(e.key, '');
            //     // console.log('mobile----',  $scope.formscope.mobile);
            // }
        };*/

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

        $scope.visitorSelectedFirst = function(selected) {
            if (selected) {
                if (selected.originalObject.name) {
                    $scope.formscope = {};

                    $scope.formscope = selected.originalObject;
                    $scope.formscope.name = selected.originalObject.first_name + " " + selected.originalObject.last_name;
                    // $scope.formscope.first_name = selected.originalObject.first_name;
                    // $scope.formscope.last_name = selected.originalObject.last_name;
                    // $scope.formscope.email = selected.originalObject.email;
                    // $scope.formscope.mobile = selected.originalObject.mobile;

                    $scope.$broadcast('angucomplete-alt:changeInput', 'firstName', selected.originalObject.first_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'lastName', selected.originalObject.last_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'email', selected.originalObject.email);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'mobile', selected.originalObject.mobile);
                } else {
                    $scope.formscope.first_name = selected.originalObject;
                }
            }
        };

        $scope.visitorSelectedLast = function(selected) {
            if (selected) {
                if (selected.originalObject.name) {
                    $scope.formscope = {};

                    $scope.formscope = selected.originalObject;
                    $scope.formscope.name = selected.originalObject.first_name + " " + selected.originalObject.last_name;
                    // $scope.formscope.first_name = selected.originalObject.first_name;
                    // $scope.formscope.last_name = selected.originalObject.last_name;
                    // $scope.formscope.email = selected.originalObject.email;
                    // $scope.formscope.mobile = selected.originalObject.mobile;

                    $scope.$broadcast('angucomplete-alt:changeInput', 'firstName', selected.originalObject.first_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'lastName', selected.originalObject.last_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'email', selected.originalObject.email);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'mobile', selected.originalObject.mobile);
                } else {
                    $scope.formscope.last_name = selected.originalObject;
                }
            }
        };

        $scope.visitorSelectedEmail = function(selected) {
            if (selected) {
                if (selected.originalObject.name) {
                    $scope.formscope = {};

                    $scope.formscope = selected.originalObject;
                    // $scope.formscope.name = selected.originalObject.first_name +" "+ selected.originalObject.last_name;
                    // $scope.formscope.first_name = selected.originalObject.first_name;
                    // $scope.formscope.last_name = selected.originalObject.last_name;
                    // $scope.formscope.email = selected.originalObject.email;
                    // $scope.formscope.mobile = selected.originalObject.mobile;

                    $scope.$broadcast('angucomplete-alt:changeInput', 'firstName', selected.originalObject.first_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'lastName', selected.originalObject.last_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'email', selected.originalObject.email);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'mobile', selected.originalObject.mobile);
                } else {
                    $scope.formscope.email = selected.originalObject;
                }
            }
        };

        $scope.visitorSelectedMobile = function(selected) {
            if (selected) {
                if (selected.originalObject.name) {
                    $scope.formscope = {};

                    $scope.formscope = selected.originalObject;
                    // $scope.formscope.name = selected.originalObject.first_name +" "+ selected.originalObject.last_name;
                    // $scope.formscope.first_name = selected.originalObject.first_name;
                    // $scope.formscope.last_name = selected.originalObject.last_name;
                    // $scope.formscope.email = selected.originalObject.email;
                    // $scope.formscope.mobile = selected.originalObject.mobile;

                    $scope.$broadcast('angucomplete-alt:changeInput', 'firstName', selected.originalObject.first_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'lastName', selected.originalObject.last_name);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'email', selected.originalObject.email);
                    $scope.$broadcast('angucomplete-alt:changeInput', 'mobile', selected.originalObject.mobile);
                } else {
                    $scope.formscope.mobile = selected.originalObject;
                }
            }
        };

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

        $scope.MomentosOption = [{ name: 'Please select momento', id: null }];
        MomentosFactory.getRecords().success(function(response) {
            $scope.MomentosOption = $scope.MomentosOption.concat(response.data);
        }).error(function(error) {

        });

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = Contactmanagement.validation;

        /*$scope.search = function(userInputString) {
            var searchData = {
                search_value: userInputString
            };

            var searchResult = [];
            Contactmanagement.checkRecordByPhone(searchData).success(function(response) {
                searchResult.push(response);
            }).error(function(error) {

            });

            return $timeout(function() {
                return searchResult[0];
            }, 500);
        }*/

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function(success) {
                $scope.formscope.name = $scope.formscope.first_name + " " + $scope.formscope.last_name;

                if ($scope.formscope.gender) {
                    $scope.formscope.gender_txt = $scope.genderOption.filter(function(option) {
                        return option.value === $scope.formscope.gender;
                    })[0].label;
                } else {
                    $scope.formscope.gender_txt = '';
                }

                if ($scope.formscope.organization_id) {
                    $scope.formscope.organization_txt = $scope.OrganizationOption.filter(function(option) {
                        return option.id === $scope.formscope.organization_id;
                    })[0].name;
                } else {
                    $scope.formscope.organization_txt = '';
                }

                if ($scope.formscope.visitor_type) {
                    $scope.formscope.visitor_txt = $scope.VisitorOption.filter(function(option) {
                        return option.id === $scope.formscope.visitor_type;
                    })[0].name;
                } else {
                    $scope.formscope.visitor_txt = '';
                }

                $uibModalInstance.close($scope.formscope);
            }).error(function(error) {
                $scope.isSubmitted = false;
            });
        };
    }
})();