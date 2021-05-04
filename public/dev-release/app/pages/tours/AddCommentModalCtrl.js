/**
 * @author a.demeshko
 * created on 21.01.2016
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.tours')
        .controller('AddCommentModalCtrl', AddCommentModalCtrl);

    /** @ngInject */
    function AddCommentModalCtrl($scope, $uibModalInstance) {
        $scope.comment = '';
        $scope.message = '';
        $scope.ok = function() {
            $uibModalInstance.close($scope.comment);
        };
    }
})();