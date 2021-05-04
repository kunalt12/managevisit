(function () {
    "use strict";
    angular.module("BlurAdmin.pages.tours")
        .controller("AddMeetingModalCtrl", AddMeetingModalCtrl)
    function AddMeetingModalCtrl($scope, fileReader, $injector, $uibModalInstance, Contactmanagement, meetingInfo) {
        $scope.formscope = {};
        $scope.meetingtime_hour = [
            {
                value: "1",
                label: "1",
                isDisabled: !1
            },
            {
                value: "2",
                label: "2",
                isDisabled: !1
            },
            {
                value: "3",
                label: "3",
                isDisabled: !1
            },
            {
                value: "4",
                label: "4",
                isDisabled: !1
            },
            {
                value: "5",
                label: "5",
                isDisabled: !1
            },
            {
                value: "6",
                label: "6",
                isDisabled: !1
            },
            {
                value: "7",
                label: "7",
                isDisabled: !1
            },
            {
                value: "8",
                label: "8",
                isDisabled: !1
            },
            {
                value: "9",
                label: "9",
                isDisabled: !1
            },
            {
                value: "10",
                label: "10",
                isDisabled: !1
            },
            {
                value: "11",
                label: "11",
                isDisabled: !1
            },
            {
                value: "12",
                label: "12",
                isDisabled: !1
            },
        ];
        $scope.meetingtime_min = [
            {
                value: "00",
                label: "00",
                isDisabled: !1
            },
            {
                value: "05",
                label: "05",
                isDisabled: !1
            },
            {
                value: "10",
                label: "10",
                isDisabled: !1
            },
            {
                value: "15",
                label: "15",
                isDisabled: !1
            },
            {
                value: "20",
                label: "20",
                isDisabled: !1
            },
            {
                value: "25",
                label: "25",
                isDisabled: !1
            },
            {
                value: "30",
                label: "30",
                isDisabled: !1
            },
            {
                value: "35",
                label: "35",
                isDisabled: !1
            },
            {
                value: "40",
                label: "40",
                isDisabled: !1
            },
            {
                value: "45",
                label: "45",
                isDisabled: !1
            },
            {
                value: "50",
                label: "50",
                isDisabled: !1
            },
            {
                value: "55",
                label: "55",
                isDisabled: !1
            },
        ],
            $scope.meetingtime_format = [
                {
                    value: "AM",
                    label: "AM",
                    isDisabled: !1
                },
                {
                    value: "PM",
                    label: "PM",
                    isDisabled: !1
                },
            ];
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.titleName = "Add Meeting";
        $scope.minDateMoment = moment().subtract("day");
        $scope.formscope.mobile_country_code = "1";
        $scope.formscope.comment = "";        
        if (meetingInfo.first_name) {
            $scope.btnName = "Update";
            $scope.titleName = "Edit Meeting";
            $scope.formscope.meetingtime_hour = meetingInfo.meetingtime_hour;
            $scope.formscope.meetingtime_min = meetingInfo.meetingtime_min;
            $scope.formscope.meetingtime_format = meetingInfo.meetingtime_format;
            $scope.formscope.first_name = meetingInfo.first_name;
            $scope.formscope.last_name = meetingInfo.last_name;
            $scope.formscope.email = meetingInfo.email;
            $scope.formscope.comment = meetingInfo.comment;
            var mobileString;
            if (meetingInfo.mobile && meetingInfo.mobile.indexOf('-') > -1) {
                mobileString = meetingInfo.mobile.split('-');
                meetingInfo.mobile_country_code = mobileString[0];
                meetingInfo.mobile = mobileString[1];
            } else {
                meetingInfo.mobile_country_code = "1";
            }
            $scope.formscope.mobile_country_code = meetingInfo.mobile_country_code;
            $scope.formscope.mobile = meetingInfo.mobile;
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
                    $scope.$broadcast("angucomplete-alt:changeInput", "mobile", t.mobile);
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