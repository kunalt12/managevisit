/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('FeedbackCtrl', FeedbackCtrl);

    /** @ngInject */
    function FeedbackCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, ToursFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = "View";
        $scope.btnName = "Send";
        $scope.isSubmitted = !1;
        $scope.urlID = $stateParams.id;
        $scope.formscope = {
            id: $scope.urlID,
            rating: 1
        };
        $scope.filledForm = "You have already fill this form.";
        $scope.displayForm = !1;
        $scope.filled = !1, ToursFactory.viewFeedback($scope.urlID).success(function (t) {
            t.data && ($scope.filled = !0);
            $scope.displayForm = !0
        }).error(function (e) {
            Notification.error(e.error);
        });
        $scope.setRating = function (t) {
            $scope.formscope.rating = t
        };
        var m = $injector.get("$validation");
        $scope.errorMessage = ToursFactory.validation;
        $scope.add_data = function (t) {
            m.validate(t).success(function () {
                $scope.isSubmitted = !0;
                ToursFactory.addFeedback($scope.formscope).success(function (t) {
                    $scope.filledForm = t.success;
                    Notification.success(t.success);
                    $scope.filled = !0;
                    $scope.isSubmitted = !1;
                }).error(function (t) {
                    Notification.error(t.error);
                    $scope.isSubmitted = !1;
                })
            })
        }
    }
})();