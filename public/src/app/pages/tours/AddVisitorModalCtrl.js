/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddVisitorModalCtrl', AddVisitorModalCtrl);

    /** @ngInject */
    function AddVisitorModalCtrl($scope, fileReader, $filter, $timeout, $uibModal, $rootScope, $compile, $injector, $uibModalInstance, Notification, UsersFactory, Contactmanagement, ToursFactory, VisitorsFactory, OrganizationsFactory, organizationName, organizationNameData, visitorInfo, MomentosFactory, isEdit, AffiliationsFactory) {
        $scope.visitorUser = {};
        $scope.formscope = {
            gender: null,
            momentos: null,
            organization_id: null,
            visitor_type: null,
            country_id: null,
            organization: organizationName
        };
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.titleName = "Add Visitor";
        $scope.addMomento = isEdit;
        $scope.formscope.country_code = "1";
        $scope.formscope.phone_number_country_code = "1";
        if (visitorInfo.first_name) {
            $scope.btnName = "Update";
            $scope.titleName = "Edit Visitor";
            $scope.formscope.first_name = visitorInfo.first_name;
            $scope.formscope.middle_name = visitorInfo.middle_name;
            $scope.formscope.last_name = visitorInfo.last_name;
            $scope.formscope.affiliate = visitorInfo.affiliate;
            $scope.formscope.email = visitorInfo.email;
            var mobileString;
            if (visitorInfo.mobile && visitorInfo.mobile.indexOf('-') > -1) {
                mobileString = visitorInfo.mobile.split('-');
                visitorInfo.country_code = mobileString[0];
                visitorInfo.mobile = mobileString[1];
            } else {
                visitorInfo.country_code = "1";
            }

            var phoneNumberString;
            if (visitorInfo.phone_number && visitorInfo.phone_number.indexOf('-') > -1) {
                phoneNumberString = visitorInfo.phone_number.split('-');
                visitorInfo.phone_number_country_code = phoneNumberString[0];
                visitorInfo.phone_number = phoneNumberString[1];
            } else {
                visitorInfo.phone_number_country_code = "1";
            }
            $scope.formscope.country_code = visitorInfo.country_code;
            $scope.formscope.mobile = visitorInfo.mobile;
            $scope.formscope.phone_number = visitorInfo.phone_number;
            $scope.formscope.phone_number_country_code = visitorInfo.phone_number_country_code;
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
        }
        $scope.$broadcast("angucomplete-alt:changeInput", "organization", organizationName);
        $scope.showDropdownFirstName = !1;
        $scope.showDropdownLastName = !1;
        $scope.showDropdownEmail = !1;
        $scope.showDropdownMobile = !1;
        $scope.searching = !1;
        $scope.textNoResults = "";
        $scope.genderOption = [{
            label: "Please select gender",
            value: null
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }], $scope.closePopup = function (t) {
            $scope.searchResult1 = [];
            $scope.showDropdownFirstName = !1;
            $scope.showDropdownLastName = !1
        };
        $scope.hoverRow = function (t) {
            $scope.currentIndex = t
        };
        $scope.searchResult1 = [];

        $scope.checkPhoneNumber = function (value, filed, e) {
            if (value) {
                var data = {
                    search_value: value
                };

                if (e) {
                    if (e.keyCode == 8 || (e.keyCode >= 48 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105)) {
                        if (value.length >= 2) {
                            Contactmanagement.checkRecordByPhone(data).success(function (response) {
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
                            }).error(function (error) {

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


        $scope.selectResult = function (t) {
            if (t.name) {
                $scope.formscope = {};
                var mobileString;
                if (t.mobile && t.mobile.indexOf('-') > -1) {
                    mobileString = t.mobile.split('-');
                    t.country_code = mobileString[0];
                    t.mobile = mobileString[1];
                } else {
                    t.country_code = 1;
                }
                var phoneNumberString;
                if (t.phone_number && t.phone_number.indexOf('-') > -1) {
                    phoneNumberString = t.phone_number.split('-');
                    t.phone_number_country_code = phoneNumberString[0];
                    t.phone_number = phoneNumberString[1];
                } else {
                    t.phone_number_country_code = 1;
                }
                $scope.formscope = t;
                $scope.formscope.name = t.first_name + " " + t.last_name;
                $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.first_name);
                $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.last_name);
                $scope.$broadcast("angucomplete-alt:changeInput", "email", t.email);
                $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.mobile);
            } else {
                $scope.formscope.first_name = t;
            }
        };
        $scope.searchMobileResult = [];
        $scope.organizationNameOption = organizationNameData;
        $scope.residentSelected = function (t) {
            if (t) {
                if (t.originalObject.organization) {
                    $scope.formscope.organization = t.originalObject.organization;
                } else {
                    $scope.formscope.organization = t.originalObject;
                }
            }
        };
        $scope.visitorSelectedFirst = function (t) {
            if (t) {
                if (t.originalObject.name) {
                    $scope.formscope = {};
                    $scope.formscope = t.originalObject;
                    $scope.formscope.name = t.originalObject.first_name + " " + t.originalObject.last_name;
                    $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.originalObject.first_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.originalObject.last_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "email", t.originalObject.email);
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.originalObject.mobile);
                } else {
                    $scope.formscope.first_name = t.originalObject;
                }
            }
        };
        $scope.visitorSelectedLast = function (t) {
            if (t) {
                if (t.originalObject.name) {
                    $scope.formscope = {};
                    $scope.formscope = t.originalObject;
                    $scope.formscope.name = t.originalObject.first_name + " " + t.originalObject.last_name;
                    $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.originalObject.first_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.originalObject.last_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "email", t.originalObject.email);
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.originalObject.mobile);
                } else {
                    $scope.formscope.last_name = t.originalObject;
                }
            }
        };
        $scope.visitorSelectedEmail = function (t) {
            if (t) {
                if (t.originalObject.name) {
                    $scope.formscope = {};
                    $scope.formscope = t.originalObject;
                    $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.originalObject.first_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.originalObject.last_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "email", t.originalObject.email);
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.originalObject.mobile);
                } else {
                    $scope.formscope.email = t.originalObject;
                }
            }
        };
        $scope.visitorSelectedMobile = function (t) {
            if (t) {
                if (t.originalObject.name) {
                    $scope.formscope = {};
                    $scope.formscope = t.originalObject;
                    $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.originalObject.first_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.originalObject.last_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "email", t.originalObject.email);
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.originalObject.mobile);
                } else {
                    $scope.formscope.mobile = t.originalObject;
                }
            }
        };
        $scope.countries = [{
            id: null,
            country_name: "Please select country"
        }], UsersFactory.getCountry().success(function (t) {
            $scope.countries = $scope.countries.concat(t)
        }).error(function (e) { }),
            $scope.AffiliateOption = [{
                name: "Please select an affiliate",
                id: null
            }];
        AffiliationsFactory.getRecords().success(function (t) {
            $scope.AffiliateOption = $scope.AffiliateOption.concat(t.data)
        }).error(function (e) { });
        $scope.OrganizationOption = [{
            name: "Please select organization type",
            id: null
        }];
        OrganizationsFactory.getRecords().success(function (t) {
            $scope.OrganizationOption = $scope.OrganizationOption.concat(t.data)
        }).error(function (e) { });
        $scope.VisitorOption = [{
            name: "Please select visitor type",
            id: null
        }];
        VisitorsFactory.getRecords().success(function (t) {
            $scope.VisitorOption = $scope.VisitorOption.concat(t.data)
        }).error(function (e) { });
        $scope.MomentosOption = [{
            name: "Please select momento",
            id: null
        }];
        MomentosFactory.getRecords().success(function (t) {
            $scope.MomentosOption = $scope.MomentosOption.concat(t.data)
        }).error(function (e) { });
        var y = $injector.get("$validation");
        $scope.errorMessage = Contactmanagement.validation;
        $scope.add_data = function (t) {
            y.validate(t).success(function (t) {
                $scope.formscope.name = $scope.formscope.first_name + " " + $scope.formscope.last_name;
                $scope.formscope.mobile = $scope.formscope.country_code + "-" + $scope.formscope.mobile;
                $scope.formscope.phone_number = $scope.formscope.phone_number_country_code + "-" + $scope.formscope.phone_number;
                if ($scope.formscope.gender) {
                    $scope.formscope.gender_txt = $scope.genderOption.filter(function (t) {
                        return t.value === $scope.formscope.gender
                    })[0].label
                } else {
                    $scope.formscope.gender_txt = "";
                }
                if ($scope.formscope.organization_id) {
                    var tempOrganisation = $scope.OrganizationOption.filter(function (t) {
                        return t.id === $scope.formscope.organization_id
                    });
                    $scope.formscope.organization_txt = tempOrganisation.length ? tempOrganisation[0].name : '';
                } else {
                    $scope.formscope.organization_txt = "";
                }
                if ($scope.formscope.visitor_type) {
                    var tempVisitorTxt = ($scope.formscope.visitor_txt = $scope.VisitorOption.filter(
                        function (t) {
                            return (
                                t.id ===
                                $scope.formscope.visitor_type
                            );
                        }
                    ));
                    $scope.formscope.visitor_txt = tempVisitorTxt.length > 0 ? tempVisitorTxt[0].name : '';
                } else {
                    $scope.formscope.visitor_txt = "";
                }
                $uibModalInstance.close($scope.formscope);
            }).error(function (t) {
                $scope.isSubmitted = !1
            })
        }
    }
})();