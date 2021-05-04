(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('TourMailModalCtrl', TourMailModalCtrl);
    
    /** @ngInject */
    function TourMailModalCtrl($scope, $rootScope, $compile, $injector, $uibModalInstance, $timeout, Notification, tourStatus) {
        if(tourStatus == 4){
            $scope.formscope = {
                mailSubject : 'Feedback for Tour',
                mailContent : "<p>Jay Swaminarayan! </p><p> Hope you all enjoyed a lot in tour. </p><p> Your feedback are appreciated, please click on below link and provide us your feedback. </p>"
            };
        }else if(tourStatus == 3 || tourStatus == 2 || tourStatus == 1){
            $scope.formscope = {
                mailSubject : 'Tour Status Information',
                mailContent : "<p>Jay Swaminarayan! </p><p>Tour status is as follow:</p><p>Tour Name: {tourname} </p><p>Tour Status: {tourstatus} </p>"
            };
        } else { 
            $scope.formscope = {
                mailSubject : 'Welcome to Tour Management',
                mailContent : "<p>Jay Swaminarayan! </p><p> As per your request, we have registered your Tour with our system on date: {startdate} </p><p> Please acknowledge your confirmation by click on this link. </p>"
            };
        }
        
        $scope.displayEditor = false;
        $timeout(function() {
            $scope.displayEditor = true;
        }, 100);
        
        $scope.sendMail = function() {
            $scope.formscope.sendMail = 1;
            $uibModalInstance.close($scope.formscope);
        };
        
        $scope.donotsendMail = function() {
            $scope.formscope.sendMail = 0;
            $uibModalInstance.close($scope.formscope);
        };
    }
})();