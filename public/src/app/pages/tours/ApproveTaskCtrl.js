/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('ApproveTaskCtrl', ApproveTaskCtrl);

    /** @ngInject */
    function ApproveTaskCtrl($scope, ToursFactory, $stateParams, $injector, Notification, $state) {
        $scope.isSubmitted = false;
        console.log("$stateParams -----", $stateParams);
        $scope.urlID = $stateParams.id;
        $scope.formscope = {
            id: $scope.urlID,
            approved_status: null
        };
        $scope.filledForm = "You have already acknowledged the task.";
        // $scope.displayForm = !1;
        $scope.displayForm = !0;
        $scope.filled = !1;
        console.log("------INIT CONSOLE-----");
        ToursFactory.getTaskApprovedStatus($scope.urlID).success(function (t) {
            console.log("API SUCCESS CONSOLE -----");
            if (t.data) {
                $scope.task = t.data;
                $scope.tour = t.tourdata;
                if ($scope.task.acknowledge > 0) {
                    ($scope.filled = !0);
                }
            }
            $scope.displayForm = !0;
        }).error(function (e) {
            console.log("API FAILED CONSOLE -----");
            $scope.displayForm = !1;
            Notification.error(e.error);
        });
        var m = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation;
        $scope.approveRejectTour = function (status) {
            $scope.formscope.approved_status = status;
            ToursFactory.acknowledgeTask($scope.formscope).success(function (t) {
                $scope.filledForm = t.success;
                Notification.success(t.success);
                $scope.filled = !0;
                $scope.isSubmitted = true;
                $state.reload();
            }).error(function (t) {
                Notification.error(t.error);
                $scope.isSubmitted = true;
            });
        };
    }
})();