/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.clients')
        .controller('editProfileCtrl', editProfileCtrl);

    /** @ngInject */
    function editProfileCtrl($scope, fileReader, $filter, $uibModal, $cookies, $rootScope, $compile, ClientsFactory, $timeout, $stateParams, $state, $injector, Notification, RolesFactory) {
        $scope.pageName = "Edit Client";
        $scope.btnName = "Update Profile";
        $scope.isSubmitted = !1;
        $scope.urlID = $rootScope.auth_user.id; // Donot change this from user to client as it specifies a general user
        $scope.uploadPicture = function () {
            var e = document.getElementById("uploadFile");
            e.click();
        };
        $scope.time_hour = [{
                value: "00",
                label: "00",
                isDisabled: !1
            },
            {
                value: "01",
                label: "01",
                isDisabled: !1
            },
            {
                value: "02",
                label: "02",
                isDisabled: !1
            },
            {
                value: "03",
                label: "03",
                isDisabled: !1
            },
            {
                value: "04",
                label: "04",
                isDisabled: !1
            },
            {
                value: "05",
                label: "05",
                isDisabled: !1
            },
            {
                value: "06",
                label: "06",
                isDisabled: !1
            },
            {
                value: "07",
                label: "07",
                isDisabled: !1
            },
            {
                value: "08",
                label: "08",
                isDisabled: !1
            },
            {
                value: "09",
                label: "09",
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
        $scope.time_min = [{
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
        ];
        $scope.am_pm = [{
                value: "am",
                label: "AM",
                isDisabled: !1
            },
            {
                value: "pm",
                label: "PM",
                isDisabled: !1
            }
        ];
        $scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        ClientsFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
        }).error(function (e) {
            Notification.error(e.error);
            $state.go("roles.list");
        });
        $scope.genderOption = [{
            label: "Please select gender",
            value: ""
        }, {
            label: "Male",
            value: "m"
        }, {
            label: "Female",
            value: "f"
        }];
        $scope.clientTypeOption = [{
            id: null,
            name: "Please select client type"
        }];
        RolesFactory.roleList().success(function (t) {
            $scope.clientTypeOption = $scope.clientTypeOption.concat(t.data);
        }).error(function (e) {});
        $scope.countries = [{
            id: null,
            country_name: "Please select country"
        }];
        ClientsFactory.getCountry().success(function (t) {
            $scope.countries = $scope.countries.concat(t);
        }).error(function (e) {});
        ClientsFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
            $scope.tempDays = $scope.formscope;
            $scope.days.forEach(function (day) {
                if (!$scope.tempDays[day + '_start']) {
                    var start = {};
                    start['hour'] = "";
                    start['min'] = "";
                    start['am_pm'] = "";
                    $scope.tempDays[day + '_start'] = start;
                }
                if (!$scope.tempDays[day + '_stop']) {
                    var stop = {};
                    stop['hour'] = "";
                    stop['min'] = "";
                    stop['am_pm'] = "";
                    $scope.tempDays[day + '_stop'] = stop;
                }
                if ($scope.tempDays[day + '_full_day']) {
                    $scope.tempDays[day + '_full_day'] = $scope.tempDays[day + '_full_day'] == 1 ? true : false;
                }
            });
            $scope.formscopestatus = {
                status: $scope.formscope.availability
            };
            $scope.formscopestatus = Object.assign($scope.formscopestatus, $scope.tempDays);
            if ($scope.formscope.image) {
                $scope.imageUrl = config.profile_url + "/" + $scope.formscope.id + "/" + $scope.formscope.image;
            } else {
                $scope.imageUrl = config.profile_url + "/noImage.png";
            }
        }).error(function (e) {
            Notification.error(e.error);
            $state.go("roles.list");
        });
        $scope.errorMessage = ClientsFactory.validation;
        $scope.add_data = function (t) {
            $scope.isSubmitted = !0, g.validate(t).success(function () {
                $scope.formscope._method = "PUT";
                if (void 0 === $scope.formscope.dob) $scope.formscope.dob = null;
                else {
                    $scope.formscope.dob = moment($scope.formscope.dob).format("YYYY-MM-DD");
                    if ("Invalid date" == $scope.formscope.dob) {
                        return Notification.error("Please enter valid date."), $scope.formscope.dob = "", void($scope.isSubmitted = !1);
                    }
                    var t = (new moment).format("YYYY-MM-DD");
                    if ($scope.formscope.dob > t) return Notification.error("Please enter valid date."), void($scope.isSubmitted = !1);
                };
                ClientsFactory.editProfile($scope.urlID, $scope.formscope).success(function (t) {
                    Notification.success(t.success);
                    if (t.data.image) {
                        $scope.imageUrl = config.profile_url + "/" + t.data.id + "/" + t.data.image;
                    } else {
                        $scope.imageUrl = config.profile_url + "/noImage.png";
                    };
                    var a = {};
                    a = t.data, $cookies.put("authUser", JSON.stringify(a)); // Donot change this from user to client as it specifies a general user
                    $scope.isSubmitted = !1;
                }).error(function (t) {
                    Notification.error(t.error);
                    $scope.isSubmitted = !1;
                })
            }).error(function (t) {
                $scope.isSubmitted = !1
            })
        };
        $scope.changepassformscope = {};
        var g = $injector.get("$validation");
        g.setExpression({
            confirmPassword: function (e, t, a, o) {
                return t.changepassformscope.new_password === t.changepassformscope.confirm_password;
            }
        }).setDefaultMsg({
            confirmPassword: {
                error: "Passwords do not match."
            }
        });
        $scope.change_password = function (t) {
            $scope.isSubmitted = !0;
            g.validate(t).success(function () {
                ClientsFactory.updatePassword($scope.urlID, $scope.changepassformscope).success(function (t) {
                    Notification.success(t.success);
                    $scope.isSubmitted = !1;
                    $scope.changepassformscope = {};
                }).error(function (t) {
                    Notification.error(t.error);
                    $scope.isSubmitted = !1;
                })
            }).error(function () {
                $scope.isSubmitted = !1;
            })
        };
        $scope.change_availability = function (t) {
            $scope.isSubmitted = !0;
            g.validate(t).success(function () {
                if ($scope.formscope.availability === $scope.formscopestatus.status) {
                    Notification.error("You have already defined this availability status. please select other availability status.");
                    $scope.isSubmitted = !1;
                } else {
                    ClientsFactory.updateAvailability($scope.urlID, $scope.formscopestatus).success(function (t) {
                        Notification.success(t.success);
                        $scope.formscope.availability = $scope.formscopestatus.status;
                        $scope.formscopestatus.comment = "";
                        $scope.isSubmitted = !1;
                    }).error(function (t) {
                        Notification.error(t.error);
                        $scope.isSubmitted = !1;
                    })
                }
            }).error(function (t) {
                $scope.isSubmitted = !1;
            })
        }
    }
})();