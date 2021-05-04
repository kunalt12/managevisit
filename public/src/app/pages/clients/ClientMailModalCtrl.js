(function () {
    'use strict';

    angular.module('BlurAdmin.pages.clients')
        .controller('ClientMailModalCtrl', ClientMailModalCtrl);

    /** @ngInject */
    function ClientMailModalCtrl($scope, $rootScope, $compile, $injector, $uibModalInstance, $timeout, Notification) {
        $scope.formscope = {
            mailSubject: "Welcome to Tour Management",
            mailContent: "<p>Jay Swaminarayan! </p><p> Welcome to Tour Management System </p><p> We have added you as {rolename} in tour management </p><p> Login details are as below.</p> "
        };
        $scope.displayEditor = !1, $timeout(function () {
            $scope.displayEditor = !0;
        }, 100);
        $scope.sendMail = function () {
            $scope.formscope.sendMail = 1;
            $uibModalInstance.close($scope.formscope);
        };
        $scope.donotsendMail = function () {
            $scope.formscope.sendMail = 0;
            $uibModalInstance.close($scope.formscope);
        }
    }
})();