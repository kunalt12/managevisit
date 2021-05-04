(function() {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UserMailModalCtrl', UserMailModalCtrl);
    
    /** @ngInject */
    function UserMailModalCtrl($scope, $rootScope, $compile, $injector, $uibModalInstance, $timeout, Notification) {
        $scope.formscope = {
            mailSubject : 'Welcome to Tour Management',
            mailContent : "<p>Jay Swaminarayan! </p><p> Welcome to Tour Management System </p><p> We have added you as {rolename} in tour management </p><p> Login details are as below.</p> "
        }; 
        
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