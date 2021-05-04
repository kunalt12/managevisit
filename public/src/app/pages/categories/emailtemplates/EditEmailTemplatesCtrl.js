/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.categories.affiliations')
        .controller('EditEmailTemplatesCtrl', EditEmailTemplatesCtrl);

    /** @ngInject */
    function EditEmailTemplatesCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, EmailtemplatesFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "Edit Email";
        $scope.btnName = "Update";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
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
        var m = $injector.get("$validation");
        $scope.errorMessage = EmailtemplatesFactory.validation, EmailtemplatesFactory.getRecord($scope.urlID).success(function (t) {
            $scope.formscope = t.data;
            $scope.formscope.is_default = $scope.formscope.is_default === 1 ? true : false;
            $scope.getAllEmailTemplates();
        }).error(function (e) {
            Notification.error(e.error), $state.go("categories.emailtemplates.list")
        }), $scope.getAllEmailTemplates = function () {
            EmailtemplatesFactory.getRecords().success(function (t) {
                $scope.emailTemplates = t.data;
                $scope.formscope.emailtype = $scope.formscope.emailtype.toString();
                for (var i = 0; i < $scope.emailTemplates.length; i++) {
                    if (($scope.formscope.emailtype == $scope.emailTemplates[i]['emailtype']) &&
                        ($scope.emailTemplates[i]['is_default'] === 1) &&
                        ($scope.emailTemplates[i]['id'] !== $scope.formscope.id)) {
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
        }, $scope.checkManualValidation = function (t) {
            for (var i = 0; i < $scope.emailTemplates.length; i++) {
                if (($scope.formscope.emailtype == $scope.emailTemplates[i]['emailtype']) &&
                    ($scope.emailTemplates[i]['is_default'] === 1) &&
                    ($scope.emailTemplates[i]['id'] !== $scope.formscope.id)) {
                    $scope.formscope.is_default = false;
                    $scope.isDisabled = true;
                    break;
                } else {
                    $scope.isDisabled = false;
                }
            }

        }, $scope.add_data = function (t) {
            $scope.temp = JSON.parse(JSON.stringify($scope.formscope));
            $scope.temp.is_default = $scope.temp.is_default ? 1 : 0;
            $scope.temp.emailtype = parseInt($scope.temp.emailtype);
            m.validate(t).success(function () {
                $scope.isSubmitted = !0, $scope.temp._method = "PUT"
                EmailtemplatesFactory.updateRecord($scope.urlID, $scope.temp).success(function (t) {
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