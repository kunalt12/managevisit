/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.emailtemplates')
        .controller('AddEmailTemplatesCtrl', AddEmailTemplatesCtrl);

    /** @ngInject */
    function AddEmailTemplatesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, EmailtemplatesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.formscope = {
            status: 1,
            emailtype: null,
            is_default: false
        };
        $scope.pageName = "Add Email";
        $scope.btnName = "Add";
        $scope.isSubmitted = !1;
        $scope.statusData = [{
            value: 0,
            text: "Inactive"
        }, {
            value: 1,
            text: "Active"
        }];
        $scope.emailtypeOption = [{
            value: null,
            text: "Please select an email action"
        }, {
            value: "0",
            text: "Tour Pending"
        }, {
            value: "1",
            text: "Tour Acknowledgement"
        }, {
            value: "2",
            text: "Tour Confirmed"
        }, {
            value: "3",
            text: "Tour Cancelled"
        }, {
            value: "4",
            text: "Tour Complete"
        }];
        EmailtemplatesFactory.getRecords().success(function (t) {
            $scope.emailTemplates = t.data;
            for (var i = 0; i < $scope.emailTemplates.length; i++) {
                if (($scope.formscope.emailtype == $scope.emailTemplates[i]['emailtype']) && ($scope.emailTemplates[i]['is_default'] === 1)) {
                    $scope.formscope.is_default = false;
                    $scope.isDisabled = true;
                    break;
                } else {
                    $scope.isDisabled = false;
                }
            }
        }).error(function (e) {
            Notification.error(e.error), $state.go("categories.emailtemplates.list")
        });
        $scope.checkManualValidation = function (t) {
            for (var i = 0; i < $scope.emailTemplates.length; i++) {
                if (($scope.formscope.emailtype == $scope.emailTemplates[i]['emailtype']) && ($scope.emailTemplates[i]['is_default'] === 1)) {
                    $scope.formscope.is_default = false;
                    $scope.isDisabled = true;
                    break;
                } else {
                    $scope.isDisabled = false;
                }
            }

        }
        var m = $injector.get("$validation");
        $scope.errorMessage = EmailtemplatesFactory.validation, $scope.add_data = function (t) {
            $scope.temp = JSON.parse(JSON.stringify($scope.formscope));
            $scope.temp.is_default = $scope.temp.is_default ? 1 : 0;
            $scope.temp.emailtype = parseInt($scope.temp.emailtype);
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, EmailtemplatesFactory.addRecord($scope.temp).success(function (t) {
                    Notification.success(t.success), $state.go("categories.emailtemplates.list"), $scope.isSubmitted = !1
                }).error(function (t) {
                    Notification.error(t.error), $scope.isSubmitted = !1
                })
            }).error(function () {
                $scope.isSubmitted = !1
            })
        }
    }
})();