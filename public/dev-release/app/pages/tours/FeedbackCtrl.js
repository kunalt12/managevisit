/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('FeedbackCtrl', FeedbackCtrl);

    /** @ngInject */
    function FeedbackCtrl($scope, fileReader, $filter, $uibModal, $rootScope, $compile, ToursFactory, $timeout, $stateParams, $state, $injector, Notification) {
        $scope.pageName = 'View';
        $scope.btnName = 'Send';
        $scope.isSubmitted = false;
        $scope.urlID = $stateParams.id;
        $scope.formscope = {
            id: $scope.urlID,
            rating: 1
        };
        $scope.filledForm = 'You have already fill this form.';
        $scope.displayForm = false;
        $scope.filled = false;
        ToursFactory.viewFeedback($scope.urlID).success(function(response) {
            if (response.data) {
                $scope.filled = true;
            }
            $scope.displayForm = true;
        }).error(function(error) {
            Notification.error(error.error);
        });

        $scope.setRating = function(e) {
            $scope.formscope.rating = e;
        };

        var $validationProvider = $injector.get('$validation');
        $scope.errorMessage = ToursFactory.validation;

        $scope.add_data = function(form) {
            $validationProvider.validate(form).success(function() {
                $scope.isSubmitted = true;

                ToursFactory.addFeedback($scope.formscope).success(function(response) {
                    $scope.filledForm = response.success;
                    Notification.success(response.success);
                    $scope.filled = true;
                    $scope.isSubmitted = false;
                }).error(function(error) {
                    Notification.error(error.error);
                    $scope.isSubmitted = false;
                });
            });
        }
    }
})();