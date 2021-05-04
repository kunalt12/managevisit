(function () {
    "use strict";
    angular.module("BlurAdmin.pages.tours")
        .controller("AddReferenceModalCtrl", AddReferenceModalCtrl);
    function AddReferenceModalCtrl($scope, fileReader, $injector, $uibModalInstance, Contactmanagement, referenceInfo) {
        $scope.formscope = {};
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.titleName = "Add Reference";
        $scope.formscope.mobile_country_code = "1";
        $scope.formscope.comment = "";
        if (referenceInfo.first_name) {
            $scope.btnName = "Update";
            $scope.titleName = "Edit Reference";
            $scope.formscope.first_name = referenceInfo.first_name;
            $scope.formscope.last_name = referenceInfo.last_name;
            $scope.formscope.email = referenceInfo.email;
            $scope.formscope.comment = referenceInfo.comment;
            var mobileString;
            if (referenceInfo.mobile && referenceInfo.mobile.indexOf('-') > -1) {
                mobileString = referenceInfo.mobile.split('-');
                referenceInfo.mobile_country_code = mobileString[0];
                referenceInfo.mobile = mobileString[1];
            } else {
                referenceInfo.mobile_country_code = "1";
            }
            $scope.formscope.mobile_country_code = referenceInfo.mobile_country_code;
            $scope.formscope.mobile = referenceInfo.mobile;
        }
        $scope.showDropdownFirstName = !1,
            $scope.showDropdownLastName = !1,
            $scope.showDropdownEmail = !1,
            $scope.showDropdownMobile = !1,
            $scope.searching = !1,
            $scope.textNoResults = "",
            $scope.closePopup = function (t) {
                $scope.searchResult1 = [], $scope.showDropdownFirstName = !1, $scope.showDropdownLastName = !1
            }, $scope.hoverRow = function (t) {
                $scope.currentIndex = t
            },
            $scope.searchResult1 = [], $scope.checkPhoneNumber = function (t, a, o) {
                if (t) {
                    var s = {
                        search_value: t
                    };
                    o && (8 == o.keyCode || o.keyCode >= 48 && o.keyCode <= 90 || o.keyCode >= 96 && o.keyCode <= 105) && t.length >= 2 && Contactmanagement.checkRecordByPhone(s).success(function (t) {
                        0 != t.data.length ? ($scope.searchResult1 = t.data, "first_name" == a ? $scope.showDropdownFirstName = !0 : "last_name" == a ? $scope.showDropdownLastName = !0 : "email" == a ? $scope.showDropdownEmail = !0 : "mobile" == a && ($scope.showDropdownMobile = !0),
                            $scope.searching = !0) : ($scope.searchResult1 = [], $scope.textNoResults = "No results found")
                    }).error(function (e) { })
                } else $scope.searchResult1 = [], "first_name" == a ? $scope.showDropdownFirstName = !1 : "last_name" == a ? $scope.showDropdownLastName = !1 : "email" == a ? $scope.showDropdownEmail = !1 : "mobile" == a && ($scope.showDropdownMobile = !1)
            },
            $scope.selectResult = function (t) {
                if (t.name) {
                    $scope.formscope = {};
                    var mobileString;
                    if (t.mobile && t.mobile.indexOf('-') > -1) {
                        mobileString = t.mobile.split('-');
                        t.mobile_country_code = mobileString[0];
                        t.mobile = mobileString[1];
                    } else {
                        t.mobile_country_code = "1";
                    }
                    $scope.formscope = t;
                    $scope.formscope.name = t.first_name + " " + t.last_name;
                    $scope.$broadcast("angucomplete-alt:changeInput", "firstName", t.first_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "lastName", t.last_name);
                    $scope.$broadcast("angucomplete-alt:changeInput", "email", t.email);
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.mobile)
                } else {
                    $scope.formscope.first_name = t
                }
            }
        var y = $injector.get("$validation");
        $scope.errorMessage = Contactmanagement.validation, $scope.add_data = function (t) {
            y.validate(t).success(function (t) {
                $scope.formscope.name = $scope.formscope.first_name + " " + $scope.formscope.last_name;
                $scope.formscope.mobile = $scope.formscope.mobile_country_code + "-" + $scope.formscope.mobile;
                $uibModalInstance.close($scope.formscope);
            }).error(function (t) {
                $scope.isSubmitted = !1
            })
        }
    }
}());