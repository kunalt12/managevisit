(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('TourMailModalCtrl', TourMailModalCtrl);

    /** @ngInject */
    function TourMailModalCtrl($scope, $state, fileReader, $filter, $rootScope, $compile, $injector, $uibModalInstance, $timeout, Notification, tourStatus, DTOptionsBuilder, DTColumnBuilder, EmailtemplatesFactory) {
        if (4 == tourStatus) {
            $scope.formscope = {
                mailSubject: "Feedback for Tour",
                mailContent: "<p>Jay Swaminarayan! </p><p> Hope you all enjoyed a lot in tour. </p><p> Your feedback are appreciated, please click on below link and provide us your feedback. </p>",
                // filterData: ""
            }
        } else if (1 == tourStatus) {
            $scope.formscope = {
                mailSubject: "Tour Status Information",
                mailContent: "<p>Jay Swaminarayan! </p><p>Your tour has been recieved but NOT confirmed. We will let you know once your tour is confirmed.</p>"
            }
        } else if (3 == tourStatus || 2 == tourStatus) {
            $scope.formscope = {
                mailSubject: "Tour Status Information",
                mailContent: "<p>Jay Swaminarayan! </p><p>Dear {visitorname}, Tour {tourname} on {startdate} is confirmed. Your contact for this tour is: {tourmanager}, {managerphone}, {manageremail}</p>"
            }
        } else {
            $scope.formscope = {
                mailSubject: "Welcome to Tour Management",
                mailContent: "<p>Jay Swaminarayan! </p><p> Dear {tourmanager}, we have registered your Tour with our system on date: {startdate} </p><p> Please acknowledge your confirmation by click on this link. </p>"
            };
        };
        $scope.findIndex = function (v, p, a) {
            for (var i = 0; i < a.length; i++) {
                if (a[i][p] === v) {
                    return i;
                }
            }
            return -1;
        };
        $scope.findIndexCustom = function (v, p, a) {
            for (var i = 0; i < a.length; i++) {
                if (a[i][p] === v && a[i]['is_default']) {
                    return i;
                }
            }
            return -1;
        };
        $scope.formData = {
            filterData: null
        };
        $scope.filerdatatable = function () {
            $scope.formscope.mailSubject = $scope.emailTemplates[$scope.findIndex($scope.formData.filterData, "id", $scope.emailTemplates)].title;
            $scope.formscope.mailContent = $scope.emailTemplates[$scope.findIndex($scope.formData.filterData, "id", $scope.emailTemplates)].html_code;
        };
        $scope.createdRow = function (t, a, o) {
            $compile(angular.element(t).contents())($scope)
        };
        $scope.reloadData = function () {
            $scope.dtInstance.rerender();
        }, EmailtemplatesFactory.getRecords().success(function (res) {
            // $scope.emailTemplates = res.data.filter(email => {
            //     return email.is_default;
            // });
            $scope.emailTemplates = res.data;
            $scope.currentTourStatus = $scope.emailTemplates[$scope.findIndexCustom(tourStatus, "emailtype", $scope.emailTemplates)];
            $scope.emailTemplates.unshift({
                title: $scope.formscope.mailSubject,
                html_code: $scope.formscope.mailContent
            });
            $scope.formData.filterData = $scope.currentTourStatus.id;
            $scope.filerdatatable();
        }).error(function (err) {
            console.log(Error, err);
        });
        $scope.displayEditor = !1, $timeout(function () {
            $scope.displayEditor = !0;
        }, 100);
        $scope.sendMail = function () {
            console.log("FORMSCOPE -----", $scope.formscope);
            $scope.formscope.status = $scope.emailTemplates[$scope.findIndex($scope.currentTourStatus.id, "id", $scope.emailTemplates)].emailtype;
            $scope.formscope.sendMail = 1;
            $uibModalInstance.close($scope.formscope);
        };
        $scope.donotsendMail = function () {
            console.log("FORMSCOPE donotsendMail-----", $scope.formscope);
            $scope.formscope.status = $scope.emailTemplates[$scope.findIndex($scope.currentTourStatus.id, "id", $scope.emailTemplates)].emailtype;
            $scope.formscope.sendMail = 0;
            $uibModalInstance.close($scope.formscope);
        }
    }
})();